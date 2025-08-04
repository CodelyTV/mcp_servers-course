export class McpResourceContentsResponse {
	private constructor(
		private readonly contents: {
			uri: string;
			mimeType: string;
			text: string;
		}[],
	) {}

	static success(uri: string, data: unknown): McpResourceContentsResponse {
		return new McpResourceContentsResponse([
			{
				uri,
				mimeType: "application/json",
				text: JSON.stringify(data, null, 2),
			},
		]);
	}

	static notFound(uri: string, message: string): McpResourceContentsResponse {
		return new McpResourceContentsResponse([
			{
				uri,
				mimeType: "application/json",
				text: JSON.stringify(
					{
						error: {
							code: -32602, // ErrorCode.InvalidParams
							message,
						},
					},
					null,
					2,
				),
			},
		]);
	}

	static internalError(
		uri: string,
		message = "Internal server error",
	): McpResourceContentsResponse {
		return new McpResourceContentsResponse([
			{
				uri,
				mimeType: "application/json",
				text: JSON.stringify(
					{
						error: {
							code: -32603, // ErrorCode.InternalError
							message,
						},
					},
					null,
					2,
				),
			},
		]);
	}

	static invalidRequest(
		uri: string,
		message: string,
	): McpResourceContentsResponse {
		return new McpResourceContentsResponse([
			{
				uri,
				mimeType: "application/json",
				text: JSON.stringify(
					{
						error: {
							code: -32600, // ErrorCode.InvalidRequest
							message,
						},
					},
					null,
					2,
				),
			},
		]);
	}

	toArray(): {
		uri: string;
		mimeType: string;
		text: string;
	}[] {
		return this.contents;
	}
}
