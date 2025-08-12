import { McpToolResponse } from "./McpToolResponse";

export interface McpTool {
	name: string;
	title: string;
	description: string;
	inputSchema: unknown;

	handler(args?: Record<string, unknown>): Promise<McpToolResponse>;
}
