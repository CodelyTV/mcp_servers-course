type TextContent = {
	type: "text";
	text: string;
};

type ImageContent = {
	type: "image";
	data: string;
	mimeType: string;
};

type ResourceContent = {
	type: "resource";
	resource: {
		uri: string;
		text?: string;
		mimeType?: string;
	};
};

type ToolContent = TextContent | ImageContent | ResourceContent;

export interface McpTool {
	name: string;
	description: {
		title: string;
		description: string;
		inputSchema: object;
	};
	handler: () => Promise<{
		content: ToolContent[];
		structuredContent?: Record<string, unknown>;
		isError?: boolean;
	}>;
}
