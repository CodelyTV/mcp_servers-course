type ResourceContent = {
	uri: string;
	mimeType?: string;
	text: string;
};

export class McpResourceContentsResponse {
	private constructor(readonly contents: ResourceContent[]) {}

	static success(uri: string, data: unknown): McpResourceContentsResponse {
		return new McpResourceContentsResponse([
			{
				uri,
				mimeType: "application/json",
				text: JSON.stringify(data),
			},
		]);
	}
}
