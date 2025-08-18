/* eslint-disable @typescript-eslint/no-explicit-any */
import { Primitives } from "@codelytv/primitives-type";
import { Client } from "@modelcontextprotocol/sdk/client/index";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport";
import { spawn } from "child_process";

import { McpTestPromptGetResponse } from "./prompts/McpTestPromptGetResponse";
import { McpTestPromptsListResponse } from "./prompts/McpTestPromptsListResponse";
import { McpTestResourceTemplatesListResponse } from "./resource-templates/McpTestResourceTemplatesListResponse";
import { McpTestResourcesListResponse } from "./resources/McpTestResourcesListResponse";
import { McpTestResourcesReadResponse } from "./resources/McpTestResourcesReadResponse";
import { McpTestToolCallResponse } from "./tools/McpTestToolCallResponse";
import { McpTestToolsListResponse } from "./tools/McpTestToolsListResponse";

export class McpTestClient {
	private readonly client: Client;
	private readonly transport: Transport;

	constructor(
		transport: "stdio" | "http",
		private readonly args: string[],
	) {
		this.client = new Client(
			{
				name: "mcp-test-client",
				version: "1.0.0",
			},
			{
				capabilities: {
					resources: {},
					tools: {},
					prompts: {},
				},
			},
		);

		if (transport === "stdio") {
			this.transport = new StdioClientTransport({
				command: this.args[0],
				args: this.args.slice(1),
			});
		} else {
			this.transport = new StreamableHTTPClientTransport(
				new URL(this.args[0]),
			);
		}
	}

	async connect(): Promise<void> {
		await this.client.connect(this.transport);
	}

	async disconnect(): Promise<void> {
		await this.client.close();
	}

	async listTools(): Promise<McpTestToolsListResponse> {
		const response = await this.client.listTools();

		return McpTestToolsListResponse.fromPrimitives({
			tools: response.tools.map((tool: any) => ({
				name: tool.name,
				title: tool.title ?? "",
				description: tool.description ?? "",
				inputSchema: tool.inputSchema ?? {},
			})),
		});
	}

	async listResources(): Promise<McpTestResourcesListResponse> {
		const response = await this.client.listResources();

		return McpTestResourcesListResponse.fromPrimitives({
			resources: response.resources.map((resource: any) => ({
				name: resource.name,
				uri: resource.uri,
				title: resource.title ?? "",
				description: resource.description ?? "",
			})),
		});
	}

	async listResourceTemplates(): Promise<McpTestResourceTemplatesListResponse> {
		const response = await this.client.listResourceTemplates();

		return McpTestResourceTemplatesListResponse.fromPrimitives({
			resourceTemplates: response.resourceTemplates.map(
				(template: any) => ({
					name: template.name,
					uriTemplate: template.uriTemplate,
					title: template.title ?? "",
					description: template.description ?? "",
				}),
			),
		});
	}

	async completeResourceTemplateParam(
		uri: string,
		paramName: string,
		textToComplete: string,
	): Promise<string[]> {
		const response = await this.client.complete({
			ref: {
				type: `ref/resource`,
				uri,
			},
			argument: {
				name: paramName,
				value: textToComplete,
			},
		});

		return response.completion.values;
	}

	async readResource(uri: string): Promise<McpTestResourcesReadResponse> {
		const response = await this.client.readResource({ uri });

		return McpTestResourcesReadResponse.fromPrimitives({
			contents: response.contents,
		});
	}

	async callTool(
		name: string,
		args: Record<string, unknown> = {},
	): Promise<McpTestToolCallResponse> {
		const response = await this.client.callTool({
			name,
			arguments: args,
		});

		return McpTestToolCallResponse.fromPrimitives({
			content: (response.content as any[]).map((content: any) => ({
				type: content.type,
				text: content.text,
				data: content.data,
				mimeType: content.mimeType,
				resource: content.resource,
			})),
			structuredContent: (response as any).structuredContent,
			isError: response.isError as boolean,
		});
	}

	async listPrompts(): Promise<McpTestPromptsListResponse> {
		const response =
			await this.execute<Primitives<McpTestPromptsListResponse>>(
				"prompts/list",
			);

		return McpTestPromptsListResponse.fromPrimitives(response);
	}

	async getPrompt(
		name: string,
		args: Record<string, unknown> = {},
	): Promise<McpTestPromptGetResponse> {
		const response = await this.execute<
			Primitives<McpTestPromptGetResponse>
		>("prompts/get", { promptName: name, promptArgs: args });

		return McpTestPromptGetResponse.fromPrimitives(response);
	}

	private async execute<T>(
		method: string,
		options: {
			uri?: string;
			params?: Record<string, unknown>;
			toolName?: string;
			toolArgs?: Record<string, unknown>;
			promptName?: string;
			promptArgs?: Record<string, unknown>;
		} = {},
	): Promise<T> {
		return new Promise((resolve, reject) => {
			const args = [
				"@modelcontextprotocol/inspector",
				"--cli",
				...this.args.slice(1),
				"--method",
				method,
			];

			if (options.uri) {
				args.push("--uri", options.uri);
			}

			if (options.toolName) {
				args.push("--tool-name", options.toolName);
			}

			if (options.promptName) {
				args.push("--prompt-name", options.promptName);
			}

			if (
				options.promptArgs &&
				Object.keys(options.promptArgs).length > 0
			) {
				const promptArgsString = Object.entries(options.promptArgs)
					.filter(([, value]) => value !== undefined)
					.map(([key, value]) => {
						const argValue = Array.isArray(value)
							? JSON.stringify(value)
							: String(value);

						return `${key}=${argValue}`;
					})
					.join(",");
				args.push("--prompt-args", promptArgsString);
			}

			if (options.toolArgs) {
				for (const [key, value] of Object.entries(options.toolArgs)) {
					if (value !== undefined) {
						const argValue = Array.isArray(value)
							? JSON.stringify(value)
							: String(value);
						args.push("--tool-arg", `${key}=${argValue}`);
					}
				}
			}

			const process = spawn("npx", args);

			let stdout = "";
			let stderr = "";

			process.stdout.on("data", (data) => {
				stdout += data.toString();
			});

			process.stderr.on("data", (data) => {
				stderr += data.toString();
			});

			process.on("close", (code) => {
				if (code !== 0) {
					reject(
						new Error(
							`Process exited with code ${code}: ${stderr}`,
						),
					);

					return;
				}

				try {
					const output = stdout.trim();
					const response = JSON.parse(output);

					resolve(response as T);
				} catch (error) {
					reject(error);
				}
			});
		});
	}
}
