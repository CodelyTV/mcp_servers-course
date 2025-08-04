import { spawn } from "child_process";

export class McpClient {
	constructor(private readonly serverPath: string) {}

	async listTools(): Promise<string[]> {
		// npx @modelcontextprotocol/inspector --cli ts-node this.serverPath
		return [];
	}

	async listResources(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			const process = spawn("npx", [
				"@modelcontextprotocol/inspector",
				"--cli",
				"--method",
				"resources/list",
				"ts-node",
				this.serverPath,
			]);

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
					const resources =
						response.resources?.map((r: any) => r.uri) || [];
					resolve(resources);
				} catch (error) {
					reject(error);
				}
			});
		});
	}
}
