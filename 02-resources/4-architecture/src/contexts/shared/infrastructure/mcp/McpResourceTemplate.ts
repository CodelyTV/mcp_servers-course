import {McpResourceResponse} from "./McpResourceResponse";

export interface McpResourceTemplate {
	name: string;
	title: string;
	description: string;
	uriTemplate: `${string}://${string}{${string}}${string}`;

	handler(
		uri: string,
		params: Record<string, string>,
	): Promise<McpResourceResponse>;
}
