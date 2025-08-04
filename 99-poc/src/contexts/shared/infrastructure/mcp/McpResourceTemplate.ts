import { McpResourceContentsResponse } from "./McpResourceContentsResponse";

export interface McpResourceTemplate {
	name: string;
	title: string;
	description: string;
	uriTemplate: string;

	handler(
		uri: URL,
		params: Record<string, string | string[]>,
	): Promise<McpResourceContentsResponse>;

	onError?(
		error: unknown,
		uri: URL,
		params: Record<string, string | string[]>,
	): McpResourceContentsResponse;
}
