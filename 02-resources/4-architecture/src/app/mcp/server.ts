/* eslint-disable @typescript-eslint/explicit-function-return-type */
import "reflect-metadata";

import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { execSync } from "node:child_process";

import { container } from "../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { McpResource } from "../../contexts/shared/infrastructure/mcp/McpResource";
import { McpResourceTemplate } from "../../contexts/shared/infrastructure/mcp/McpResourceTemplate";

const server = new McpServer({
	name: "codely-mcp",
	version: "1.0.0",
	capabilities: {
		resources: true,
		tools: true,
	},
});

server.registerTool(
	"view_disk_space",
	{
		title: "View disk space",
		description: "View the disk space in G",
	},
	() => {
		const stdout = execSync("df -h / | awk 'NR==2 {print $4}'", {
			encoding: "utf8",
		});

		return {
			content: [
				{
					type: "text",
					text: `Available disk space: ${stdout.trim()}`,
				},
			],
		};
	},
);

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
			const response = await resourceTemplate.handler(
				uri.href,
				params as Record<string, string>,
			);

			return { contents: response.contents };
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
