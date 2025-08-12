import { McpResourceContentsResponse } from "./McpResourceContentsResponse";

export interface McpResourceTemplate {
	name: string;
	title: string;
	description: string;
	uriTemplate: string;

	handler(
		uri: URL,
		params: Record<string, string>,
	): Promise<McpResourceContentsResponse>;
}
