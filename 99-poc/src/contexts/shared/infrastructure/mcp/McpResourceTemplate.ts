export interface McpResourceTemplate {
	name: string;
	title: string;
	description: string;
	uriTemplate: string;

	handler(
		uri: URL,
		variables: Record<string, string>,
	): Promise<{
		contents: Array<{
			uri: string;
			mimeType: string;
			text: string;
		}>;
	}>;
}
