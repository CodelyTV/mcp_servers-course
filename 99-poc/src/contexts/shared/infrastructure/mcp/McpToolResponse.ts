type TextContent = {
	type: "text";
	text: string;
};

type ImageContent = {
	type: "image";
	data: string; // base64-encoded
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

export class McpToolResponse {
	private constructor(
		readonly content: ToolContent[],
		readonly structuredContent?: Record<string, any>,
		readonly isError?: boolean,
	) {}

	static success(
		content: ToolContent[],
		structuredContent?: Record<string, any>,
	): McpToolResponse {
		return new McpToolResponse(content, structuredContent, false);
	}

	static text(text: string): McpToolResponse {
		return new McpToolResponse([{ type: "text", text }]);
	}

	static error(
		message: string,
		structuredContent?: Record<string, any>,
	): McpToolResponse {
		return new McpToolResponse(
			[{ type: "text", text: `Error: ${message}` }],
			structuredContent,
			true,
		);
	}

	static image(
		data: string,
		mimeType: string = "image/png",
	): McpToolResponse {
		return new McpToolResponse([{ type: "image", data, mimeType }]);
	}

	static resource(
		uri: string,
		text?: string,
		mimeType?: string,
	): McpToolResponse {
		return new McpToolResponse([
			{
				type: "resource",
				resource: { uri, text, mimeType },
			},
		]);
	}

	static structured(
		data: Record<string, any>,
		text?: string,
	): McpToolResponse {
		const displayText = text || JSON.stringify(data, null, 2);
		return new McpToolResponse([{ type: "text", text: displayText }], data);
	}
}
