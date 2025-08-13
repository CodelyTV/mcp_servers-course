import {McpResourceResponse} from "./McpResourceResponse";

type Scheme = `${Lowercase<string>}`;

export interface McpResource {
	name: string;
	title: string;
	description: string;
	uriTemplate: `${Scheme}://${string}`;

	handler(): Promise<McpResourceResponse>;
}
