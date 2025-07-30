export interface McpTool {
	name: string;
	description: {
		title: string;
		description: string;
		inputSchema: object;
	};
	handler: () => Promise<{
		content: Array<{
			type: "text";
			text: string;
		}>;
	}>;
}
