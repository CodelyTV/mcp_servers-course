import { z } from "zod";

import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";

export class PingTool implements McpTool {
	name = "ping";
	title = "Ping Tool";
	description = "Health check - confirms the server is running";
	inputSchema = {};

	async handler(_args?: Record<string, unknown>): Promise<McpToolResponse> {
		return McpToolResponse.text(
			"Pong! Courses MCP server is running correctly.",
		);
	}
}
