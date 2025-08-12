/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-explicit-any */
import "reflect-metadata";

import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { container } from "../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { McpResource } from "../../contexts/shared/infrastructure/mcp/McpResource";
import { McpResourceResponse } from "../../contexts/shared/infrastructure/mcp/McpResourceResponse";
import { McpResourceTemplate } from "../../contexts/shared/infrastructure/mcp/McpResourceTemplate";
import { McpTool } from "../../contexts/shared/infrastructure/mcp/McpTool";

const server = new McpServer({
	name: "codely-mcp",
	version: "1.0.0",
	capabilities: {
		resources: true,
		tools: true,
	},
});

const tools = container
	.findTaggedServiceIdentifiers<McpTool>("mcp-tool")
	.map((identifier) => container.get(identifier));

tools.forEach((tool) => {
	server.registerTool(
		tool.name,
		{
			title: tool.title,
			description: tool.description,
			inputSchema: tool.inputSchema as any,
		},
		async (args?: Record<string, unknown>) => {
			const response = await tool.handler(args);

			return {
				content: response.content,
				structuredContent: response.structuredContent,
				isError: response.isError,
			};
		},
	);
});

const resources = container
	.findTaggedServiceIdentifiers<McpResource>("mcp-resource")
	.map((identifier) => container.get(identifier));

resources.forEach((resource) => {
	server.registerResource(
		resource.name,
		resource.uriTemplate,
		{
			title: resource.title,
			description: resource.description,
		},
		async (_uri) => {
			const response = await resource.handler();

			return { contents: response.contents };
		},
	);
});

const resourceTemplates = container
	.findTaggedServiceIdentifiers<McpResourceTemplate>("mcp-resource_template")
	.map((identifier) => container.get(identifier));

resourceTemplates.forEach((resourceTemplate) => {
	server.registerResource(
		resourceTemplate.name,
		new ResourceTemplate(resourceTemplate.uriTemplate, {
			list: undefined,
		}),
		{
			title: resourceTemplate.title,
			description: resourceTemplate.description,
		},
		async (uri, params) => {
			try {
				const response = await resourceTemplate.handler(
					uri.href,
					params as Record<string, string>,
				);

				return { contents: response.contents };
			} catch (error) {
				if (resourceTemplate.onError) {
					const response = resourceTemplate.onError(
						error as any,
						uri.href,
						params as Record<string, string>,
					);

					return { contents: response.contents };
				}

				return {
					contents: McpResourceResponse.internalError(uri.href)
						.contents,
				};
			}
		},
	);
});

async function main() {
	const transport = new StdioServerTransport();

	await server.connect(transport);
}

main().catch((error) => {
	console.error("Server error:", error);

	process.exit(1);
});
