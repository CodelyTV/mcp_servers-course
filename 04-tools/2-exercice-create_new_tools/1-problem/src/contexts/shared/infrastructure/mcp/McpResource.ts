import { McpResourceResponse } from "./McpResourceResponse";

export interface McpResource {
	name: string;
	title: string;
	description: string;
	uriTemplate: string;

	handler(): Promise<McpResourceResponse>;
}
