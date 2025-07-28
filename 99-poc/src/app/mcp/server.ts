/* eslint-disable no-console,@typescript-eslint/explicit-function-return-type */
import "reflect-metadata";

import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { AllCoursesSearcher } from "../../contexts/mooc/courses/application/search-all/AllCoursesSearcher";
import { container } from "../../contexts/shared/infrastructure/dependency-injection/diod.config";

const server = new McpServer({
	name: "codely-mcp-server",
	version: "1.0.0",
});

server.registerTool(
	"ping",
	{
		title: "Ping Tool",
		description: "Health check - confirms the server is running",
		inputSchema: {},
	},
	async () => ({
		content: [
			{
				type: "text",
				text: "Pong! Courses MCP server is running correctly.",
			},
		],
	}),
);

server.registerResource(
	"courses",
	new ResourceTemplate("courses://all", { list: undefined }),
	{
		title: "All Courses",
		description: "Complete list of all available courses",
	},
	async (uri) => {
		const coursesSearcher = container.get(AllCoursesSearcher);
		const courses = await coursesSearcher.search();

		return {
			contents: [
				{
					uri: uri.href,
					mimeType: "application/json",
					text: JSON.stringify(courses, null, 2),
				},
			],
		};
	},
);

async function main() {
	console.info("ENTRA MAIN");
	const transport = new StdioServerTransport();
	console.info("SIGUE MAIN");
	await server.connect(transport);

	console.info("Courses MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Server error:", error);

	process.exit(1);
});

console.info("ENTRA");
