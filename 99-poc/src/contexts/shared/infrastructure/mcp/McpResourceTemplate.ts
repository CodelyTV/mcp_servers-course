import { CodelyError } from "../../domain/CodelyError";

import { McpResourceContentsResponse } from "./McpResourceContentsResponse";

export interface McpResourceTemplate {
	name: string;
	title: string;
	description: string;
	uriTemplate: string;

	handle(
		uri: URL,
		params: Record<string, string | string[]>,
	): Promise<McpResourceContentsResponse>;

	onError?(
		error: CodelyError,
		uri: URL,
		params: Record<string, string | string[]>,
	): McpResourceContentsResponse;
}
