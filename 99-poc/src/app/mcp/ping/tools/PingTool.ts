import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";

export class PingTool implements McpTool {
	name = "ping";
	title = "Ping Tool";
	description = "Health check - confirms the server is running";
	inputSchema = {};

	async handler(): Promise<McpToolResponse> {
		return McpToolResponse.text(
			"Pong! Courses MCP server is running correctly.",
		);
	}
}
