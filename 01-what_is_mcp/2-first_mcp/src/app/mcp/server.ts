/* eslint-disable @typescript-eslint/explicit-function-return-type */
import "reflect-metadata";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

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
	async () => {
		// view disk space executing `df -h / | awk 'NR==2 {print $4}'`
);

async function main() {
	const transport = new StdioServerTransport();

	await server.connect(transport);
}

main().catch((error) => {
	console.error("Server error:", error);

	process.exit(1);
});
