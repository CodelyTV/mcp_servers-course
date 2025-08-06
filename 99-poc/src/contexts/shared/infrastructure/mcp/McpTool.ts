import { McpToolResponse } from "./McpToolResponse";

export interface JsonSchema {
	type: string;
	properties?: Record<string, unknown>;
	required?: string[];
	[key: string]: unknown;
}

export interface McpTool {
	name: string;
	title: string;
	description: string;
	inputSchema: JsonSchema;

	handler(args?: Record<string, unknown>): Promise<McpToolResponse>;
}
