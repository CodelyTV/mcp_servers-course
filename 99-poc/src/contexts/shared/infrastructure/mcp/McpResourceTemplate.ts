import { McpResourceResponse } from "./McpResourceResponse";

export interface McpResourceTemplate {
	name: string;
	title: string;
	description: string;
	uriTemplate: string;

	handler(
		uri: URL,
		params: Record<string, string | string[]>,
	): Promise<McpResourceResponse>;
}
