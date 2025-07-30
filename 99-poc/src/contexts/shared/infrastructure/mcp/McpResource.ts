export interface McpResource {
	name: string;
	title: string;
	description: string;
	uriTemplate: string;

	handler(uri: URL): Promise<{
		contents: Array<{
			uri: string;
			mimeType: string;
			text: string;
		}>;
	}>;
}
