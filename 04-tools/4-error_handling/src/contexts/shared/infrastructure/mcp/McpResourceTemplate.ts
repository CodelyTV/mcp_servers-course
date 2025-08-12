import { CodelyError } from "../../domain/CodelyError";

import { McpResourceResponse } from "./McpResourceResponse";

export interface McpResourceTemplate {
	name: string;
	title: string;
	description: string;
	uriTemplate: string;

	handler(
		uri: string,
		params: Record<string, string>,
	): Promise<McpResourceResponse>;

	onError?(
		error: CodelyError,
		uri: string,
		params: Record<string, string>,
	): McpResourceResponse;
}
