import { spawn } from "child_process";

export class McpClient {
	constructor(
		private readonly runtime: string,
		private readonly serverPath: string,
	) {}

	async initialize(): Promise<any> {
		return this.executeInspectorCommand("initialize");
	}

	async listTools(): Promise<any[]> {
		const response = await this.executeInspectorCommand("tools/list");

		return response.tools || [];
	}

	async listResources(): Promise<any[]> {
		const response = await this.executeInspectorCommand("resources/list");

		return response.resources || [];
	}

	async readResource(uri: string): Promise<any> {
		return this.executeInspectorCommand("resources/read", uri);
	}

	async callTool(name: string, args: any = {}): Promise<any> {
		return new Promise((resolve, reject) => {
			const cmdArgs = [
				"@modelcontextprotocol/inspector",
				"--cli",
				"--method",
				"tools/call",
				"--tool-name",
				name,
			];

			if (Object.keys(args).length > 0) {
				cmdArgs.push("--arguments", JSON.stringify(args));
			}

			cmdArgs.push(this.runtime, this.serverPath);

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

					resolve(response);
				} catch (error) {
					reject(error);
				}
			});
		});
	}

	private async executeInspectorCommand(
		method: string,
		uri?: string,
		params?: any,
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

					resolve(response);
				} catch (error) {
					reject(error);
				}
			});
		});
	}
}
