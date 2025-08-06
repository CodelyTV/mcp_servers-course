import { McpToolResponse } from "./McpToolResponse";

export interface McpTool {
	name: string;
	title: string;
	description: string;
	inputSchema: any;

	handler(args?: any): Promise<McpToolResponse>;
}
