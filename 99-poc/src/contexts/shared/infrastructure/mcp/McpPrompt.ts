import { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";

export interface McpPrompt {
	name: string;
	title: string;
	description: string;
	inputSchema?: Record<string, unknown>;

	handler(args?: Record<string, unknown>): Promise<GetPromptResult>;
}
