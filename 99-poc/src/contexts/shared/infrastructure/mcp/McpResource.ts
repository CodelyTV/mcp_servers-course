import { McpResourceContentsResponse } from "./McpResourceContentsResponse";

export interface McpResource {
	name: string;
	title: string;
	description: string;
	uriTemplate: string;

	handler(): Promise<McpResourceContentsResponse>;
}
