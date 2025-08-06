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

export class McpToolResponse {
	private constructor(
		readonly content: ToolContent[],
		readonly structuredContent?: Record<string, string | number | object>,
		readonly isError?: boolean,
	) {}

	static text(text: string): McpToolResponse {
		return new McpToolResponse([{ type: "text", text }]);
	}

	static structured(
		data: Record<string, string | number | object>,
	): McpToolResponse {
		const text = JSON.stringify(data);

		return new McpToolResponse([{ type: "text", text }], data);
	}

	static error(message: string): McpToolResponse {
		return new McpToolResponse(
			[{ type: "text", text: `Error: ${message}` }],
			undefined,
			true,
		);
	}

	static image(data: string, mimeType: string): McpToolResponse {
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
}
