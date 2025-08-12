import { spawn } from "child_process";

import { McpToolListResponse } from "./McpToolListResponse";
import { McpToolsListResponse } from "./McpToolsListResponse";

interface McpResourceContent {
	uri: string;
	mimeType?: string;
	text?: string;
	blob?: string;
}

interface McpResourcesReadResponse {
	contents: McpResourceContent[];
}

interface McpToolContent {
	type: "text" | "image" | "resource";
	text?: string;
	data?: string;
	mimeType?: string;
	resource?: {
		uri: string;
		text?: string;
		mimeType?: string;
	};
}

interface McpToolCallResponse {
	content: McpToolContent[];
	structuredContent?: Record<string, unknown>;
	isError?: boolean;
}

interface McpListResourcesResponse {
	resources: Array<{
		uri: string;
		name: string;
		title: string;
		description: string;
	}>;
}

interface McpListResourceTemplatesResponse {
	resourceTemplates: Array<{
		name: string;
		title: string;
		uriTemplate: string;
		description: string;
	}>;
}

interface McpPrompt {
	name: string;
	title: string;
	description: string;
	argsSchema?: object;
}

interface McpListPromptsResponse {
	prompts: McpPrompt[];
}

interface McpPromptMessage {
	role: "user" | "assistant";
	content: {
		type: "text";
		text: string;
	};
}

interface McpGetPromptResponse {
	description?: string;
	messages: McpPromptMessage[];
}

export class McpInspectorCliClient {
	constructor(private readonly command: string[]) {}

	async listTools(): Promise<McpToolsListResponse> {
		const response =
			await this.executeInspectorCommand<McpToolsListResponse>(
				"tools/list",
			);

		const toolInstances = response.tools.map(
			(tool) =>
				new McpToolListResponse(
					tool.name,
					tool.title,
					tool.description,
					tool.inputSchema,
				),
		);

		return new McpToolsListResponse(toolInstances);
	}

	async listResources(): Promise<string[]> {
		const response =
			await this.executeInspectorCommand<McpListResourcesResponse>(
				"resources/list",
			);

		return response.resources.map((resource) => resource.uri);
	}

	async listResourceTemplates(): Promise<
		Array<{
			name: string;
			title: string;
			uriTemplate: string;
			description: string;
		}>
	> {
		const response =
			await this.executeInspectorCommand<McpListResourceTemplatesResponse>(
				"resources/templates/list",
			);

		return response.resourceTemplates;
	}

	async readResource(uri: string): Promise<McpResourcesReadResponse> {
		return this.executeInspectorCommand<McpResourcesReadResponse>(
			"resources/read",
			uri,
		);
	}

	async callTool(
		name: string,
		args: Record<string, unknown> = {},
	): Promise<McpToolCallResponse> {
		return new Promise((resolve, reject) => {
			const cmdArgs = [
				"@modelcontextprotocol/inspector",
				"--cli",
				...this.command,
				"--method",
				"tools/call",
				"--tool-name",
				name,
			];

			// Add tool arguments using --tool-arg format
			for (const [key, value] of Object.entries(args)) {
				cmdArgs.push("--tool-arg", `${key}=${value}`);
			}

			const process = spawn("npx", cmdArgs);

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

					resolve(response as McpToolCallResponse);
				} catch (error) {
					reject(error);
				}
			});
		});
	}

	async listPrompts(): Promise<McpPrompt[]> {
		const response =
			await this.executeInspectorCommand<McpListPromptsResponse>(
				"prompts/list",
			);

		return response.prompts;
	}

	async getPrompt(
		name: string,
		args: Record<string, unknown> = {},
	): Promise<McpGetPromptResponse> {
		return new Promise((resolve, reject) => {
			const cmdArgs = [
				"@modelcontextprotocol/inspector",
				"--cli",
				...this.command,
				"--method",
				"prompts/get",
				"--prompt-name",
				name,
			];

			// Add prompt arguments using --prompt-arg format (similar to tools)
			for (const [key, value] of Object.entries(args)) {
				cmdArgs.push("--prompt-arg", `${key}=${value}`);
			}

			const process = spawn("npx", cmdArgs);

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

					resolve(response as McpGetPromptResponse);
				} catch (error) {
					reject(error);
				}
			});
		});
	}

	private async executeInspectorCommand<T>(
		method: string,
		uri?: string,
		params?: Record<string, unknown>,
	): Promise<T> {
		return new Promise((resolve, reject) => {
			const args = [
				"@modelcontextprotocol/inspector",
				"--cli",
				"--method",
				method,
			];

			if (uri) {
				args.push("--uri", uri);
			}

			if (params) {
				args.push("--arguments", JSON.stringify(params));
			}

			args.push(...this.command);

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
