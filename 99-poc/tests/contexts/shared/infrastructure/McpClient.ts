import { spawn } from "child_process";

interface McpTool {
	name: string;
	title: string;
	description: string;
	inputSchema: object;
}

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

interface McpListToolsResponse {
	tools: McpTool[];
}

interface McpListResourcesResponse {
	resources: Array<{
		uri: string;
		name: string;
		title: string;
		description: string;
	}>;
}

export class McpClient {
	constructor(
		private readonly runtime: string,
		private readonly serverPath: string,
	) {}

	async listTools(): Promise<McpTool[]> {
		const response =
			await this.executeInspectorCommand<McpListToolsResponse>(
				"tools/list",
			);

		return response.tools;
	}

	async listResources(): Promise<string[]> {
		const response =
			await this.executeInspectorCommand<McpListResourcesResponse>(
				"resources/list",
			);

		return response.resources.map((resource) => resource.uri);
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
				this.runtime,
				this.serverPath,
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

			args.push(this.runtime, this.serverPath);

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
