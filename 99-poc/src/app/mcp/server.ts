/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unnecessary-condition,@typescript-eslint/no-explicit-any */
import "reflect-metadata";

import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { CourseByIdFinderErrors } from "../../contexts/mooc/courses/application/find/CourseFinder";
import { container } from "../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { McpResourceContentsResponse } from "../../contexts/shared/infrastructure/mcp/McpResourceContentsResponse";
import { McpTool } from "../../contexts/shared/infrastructure/mcp/McpTool";

import { CourseResourceTemplate } from "./courses/resources/CourseResourceTemplate";
import { CoursesResource } from "./courses/resources/CoursesResource";
import { PingTool } from "./ping/tools/PingTool";

function convertParamsToStrings(
	params: Record<string, string | string[]>,
): Record<string, string> {
	const result: Record<string, string> = {};

	for (const [key, value] of Object.entries(params)) {
		result[key] = Array.isArray(value) ? value[0] : value;
	}

	return result;
}

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

const pingTool = new PingTool();
tools.push(pingTool);

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
				content: response.content
					.filter((item) => item.type === "text")
					.map((item) => ({
						type: "text" as const,
						text: (item as { text: string }).text,
					})),
				structuredContent: response.structuredContent,
				isError: response.isError,
			};
		},
	);
});

const coursesResource = container.get(CoursesResource);
server.registerResource(
	coursesResource.name,
	coursesResource.uriTemplate,
	{
		title: coursesResource.title,
		description: coursesResource.description,
	},
	async (_uri) => {
		const response = await coursesResource.handler();

		return { contents: response.contents };
	},
);

const courseDetailResource = container.get(CourseResourceTemplate);
server.registerResource(
	courseDetailResource.name,
	new ResourceTemplate(courseDetailResource.uriTemplate, {
		list: async () => ({ resources: [] }),
	}),
	{
		title: courseDetailResource.title,
		description: courseDetailResource.description,
	},
	async (uri, params) => {
		try {
			const response = await courseDetailResource.handler(
				uri,
				convertParamsToStrings(params),
			);

			return { contents: response.contents };
		} catch (error) {
			if (courseDetailResource.onError) {
				const response = courseDetailResource.onError(
					error as CourseByIdFinderErrors,
					uri,
					convertParamsToStrings(params),
				);

				return { contents: response.contents };
			}

			return {
				contents: McpResourceContentsResponse.internalError(uri.href)
					.contents,
			};
		}
	},
);

async function main() {
	const transport = new StdioServerTransport();

	await server.connect(transport);
}

main().catch((error) => {
	console.error("Server error:", error);

	process.exit(1);
});
