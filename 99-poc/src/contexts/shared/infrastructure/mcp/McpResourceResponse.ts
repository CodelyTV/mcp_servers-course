export type McpResourceResponse = {
	contents: Array<{
		uri: string;
		mimeType: string;
		text: string;
	}>;
};
