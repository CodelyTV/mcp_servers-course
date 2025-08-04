import { spawn } from "child_process";

export class McpClient {
	constructor(
		private readonly runtime: string,
		private readonly serverPath: string,
	) {}

	async listTools(): Promise<string[]> {
		// npx @modelcontextprotocol/inspector --cli ts-node this.serverPath
		return [];
	}

	async listResources(): Promise<string[]> {
		const response = await this.executeInspectorCommand("resources/list");

		return response.resources?.map((r: any) => r.uri) || [];
	}

	async readResource(uri: string): Promise<any> {
		return this.executeInspectorCommand("resources/read", uri);
	}

	private async executeInspectorCommand(
		method: string,
		uri?: string,
	): Promise<any> {
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
					
					// Parse JSON content in text fields
					if (response.contents?.[0]?.text) {
						try {
							response.contents[0].text = JSON.parse(response.contents[0].text);
						} catch {
							// If JSON parsing fails, keep original text
						}
					}
					
					resolve(response);
				} catch (error) {
					reject(error);
				}
			});
		});
	}
}
