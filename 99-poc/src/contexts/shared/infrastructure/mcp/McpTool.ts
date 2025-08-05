import { McpToolResponse } from "./McpToolResponse";

export interface McpTool {
	name: string;
	title: string;
	description: string;
	inputSchema: object;
	handler: () => Promise<McpToolResponse>;
}
