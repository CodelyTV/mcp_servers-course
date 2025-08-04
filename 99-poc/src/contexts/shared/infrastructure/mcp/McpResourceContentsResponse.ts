export class McpResourceContentsResponse {
	private constructor(
		readonly contents: {
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
				text: JSON.stringify(data),
			},
		]);
	}

	static notFound(uri: string, message: string): McpResourceContentsResponse {
		return new McpResourceContentsResponse([
			{
				uri,
				mimeType: "application/json",
				text: JSON.stringify({
					error: {
						code: -32002, // Resource not found: https://modelcontextprotocol.io/specification/2025-06-18/server/resources#error-handling
						message,
						data: {
							uri,
						},
					},
				}),
			},
		]);
	}

	static internalError(
		uri: string,
		message?: string,
	): McpResourceContentsResponse {
		return new McpResourceContentsResponse([
			{
				uri,
				mimeType: "application/json",
				text: JSON.stringify({
					error: {
						code: -32603, // Internal error: https://modelcontextprotocol.io/specification/2025-06-18/server/resources#error-handling
						message: message ?? "Internal server error",
					},
				}),
			},
		]);
	}

	static badRequest(
		uri: string,
		message: string,
	): McpResourceContentsResponse {
		return new McpResourceContentsResponse([
			{
				uri,
				mimeType: "application/json",
				text: JSON.stringify({
					error: {
						code: -32000, // Bad Request: https://github.com/modelcontextprotocol/typescript-sdk/tree/0551cc52b8920d7da46a4519b42f335a0a852b6c?tab=readme-ov-file#streamable-http
						message,
					},
				}),
			},
		]);
	}
}
