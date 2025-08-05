/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";

export class PingTool implements McpTool {
	name = "ping";
	description = {
		title: "Ping Tool",
		description: "Health check - confirms the server is running",
		inputSchema: {},
	};

	async handler() {
		const response = McpToolResponse.text("Pong! Courses MCP server is running correctly.");
		return {
			content: response.content as Array<{ type: "text"; text: string }>,
		};
	}
}
