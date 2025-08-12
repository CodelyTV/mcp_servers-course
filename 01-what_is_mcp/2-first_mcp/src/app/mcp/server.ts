import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { execSync } from "child_process";

const server = new McpServer({
	name: "codely-mcp",
	version: "1.0.0",
	capabilities: {
		tools: true,
	},
});

server.registerTool(
	"view_disk_space",
	{
		title: "View disk space",
		description: "View the disk space in G",
	},
	() => {
		const stdout = execSync("df -h / | awk 'NR==2 {print $4}'", {
			encoding: "utf8",
		});

		return {
			content: [
				{
					type: "text",
					text: `Available disk space: ${stdout.trim()}`,
				},
			],
		};
	},
);

async function main(): Promise<void> {
	const transport = new StdioServerTransport();

	await server.connect(transport);
}

main().catch((error) => {
	console.error("Server error:", error);

	process.exit(1);
});
