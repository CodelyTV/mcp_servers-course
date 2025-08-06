import { McpToolResponse } from "./McpToolResponse";

interface JsonSchema {
	type: string;
	properties?: Record<
		string,
		{
			type: string;
			description?: string;
		}
	>;
	required?: string[];
}

export interface McpTool {
	name: string;
	title: string;
	description: string;
	inputSchema: JsonSchema | Record<string, never>;

	handler(args?: Record<string, unknown>): Promise<McpToolResponse>;
}
