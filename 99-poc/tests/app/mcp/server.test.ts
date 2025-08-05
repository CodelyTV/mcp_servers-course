import "reflect-metadata";

import { McpClient } from "../../contexts/shared/infrastructure/McpClient";

describe("MCP Server Integration", () => {
	const mcpClient = new McpClient("ts-node", "./src/app/mcp/server.ts");
});
