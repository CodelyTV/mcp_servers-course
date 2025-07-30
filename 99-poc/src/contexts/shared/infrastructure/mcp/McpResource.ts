import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

export interface McpResource {
	name: string;

	template: ResourceTemplate;

	description: {
		title: string;
		description: string;
	};

	handler: (uri: URL) => Promise<{
		contents: Array<{
			uri: string;
			mimeType: string;
			text: string;
		}>;
	}>;
}
