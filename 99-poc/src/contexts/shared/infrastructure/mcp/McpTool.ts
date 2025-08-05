export interface McpTool {
	name: string;
	title: string;
	description: string;
	inputSchema: object;
	handler: () => Promise<{
		content: Array<{
			type: "text";
			text: string;
		}>;
		structuredContent?: Record<string, unknown>;
		isError?: boolean;
	}>;
}
