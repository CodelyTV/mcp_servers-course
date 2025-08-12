import { Primitives } from "@codelytv/primitives-type";
import { spawn } from "child_process";

import { McpResourceTemplatesListResponse } from "./resource-templates/McpResourceTemplatesListResponse";
import { McpResourcesListResponse } from "./resources/McpResourcesListResponse";
import { McpResourcesReadResponse } from "./resources/McpResourcesReadResponse";
import { McpToolCallResponse } from "./tools/McpToolCallResponse";
import { McpToolsListResponse } from "./tools/McpToolsListResponse";

export class McpInspectorCliClient {
	constructor(private readonly command: string[]) {}

	async listTools(): Promise<McpToolsListResponse> {
		const response =
			await this.execute<Primitives<McpToolsListResponse>>("tools/list");

		return McpToolsListResponse.fromPrimitives(response);
	}

	async listResources(): Promise<McpResourcesListResponse> {
		const response =
			await this.execute<Primitives<McpResourcesListResponse>>(
				"resources/list",
			);

		return McpResourcesListResponse.fromPrimitives(response);
	}

	async listResourceTemplates(): Promise<McpResourceTemplatesListResponse> {
		const response = await this.execute<
			Primitives<McpResourceTemplatesListResponse>
		>("resources/templates/list");

		return McpResourceTemplatesListResponse.fromPrimitives(response);
	}

	async readResource(uri: string): Promise<McpResourcesReadResponse> {
		const response = await this.execute<
			Primitives<McpResourcesReadResponse>
		>("resources/read", { uri });

		return McpResourcesReadResponse.fromPrimitives(response);
	}

	async callTool(
		name: string,
		args: Record<string, unknown> = {},
	): Promise<McpToolCallResponse> {
		const response = await this.execute<Primitives<McpToolCallResponse>>(
			"tools/call",
			{ toolName: name, toolArgs: args },
		);

		return McpToolCallResponse.fromPrimitives(response);
	}

	private async execute<T>(
		method: string,
		options: {
			uri?: string;
			params?: Record<string, unknown>;
			toolName?: string;
			toolArgs?: Record<string, unknown>;
		} = {},
	): Promise<T> {
		return new Promise((resolve, reject) => {
			const args = [
				"@modelcontextprotocol/inspector",
				"--cli",
				"--method",
				method,
			];

			if (options.uri) {
				args.push("--uri", options.uri);
			}

			if (options.params) {
				args.push("--arguments", JSON.stringify(options.params));
			}

			if (options.toolName) {
				args.push("--tool-name", options.toolName);
			}

			if (options.toolArgs) {
				for (const [key, value] of Object.entries(options.toolArgs)) {
					args.push("--tool-arg", `${key}=${value}`);
				}
			}

			args.push(...this.command);

			// todo: npx should not be here, should be inside the args array
			//  when this class is instantiated
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
