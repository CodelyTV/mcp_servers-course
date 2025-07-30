export interface McpResourceTemplate {
	name: string;
	title: string;
	description: string;
	uriTemplate: string;

	handler(
		uri: URL,
		paramss: Record<string, string | string[]>,
	): Promise<{
		contents: Array<{
			uri: string;
			mimeType: string;
			text: string;
		}>;
	}>;
}
