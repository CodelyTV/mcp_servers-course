/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";

export class PingTool implements McpTool {
	name = "ping";
	description = {
		title: "Ping Tool",
		description: "Health check - confirms the server is running",
		inputSchema: {},
	};

	async handler() {
		return {
			content: [
				{
					type: "text" as const,
					text: "Pong! Courses MCP server is running correctly.",
				},
			],
		};
	}
}
