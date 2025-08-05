/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unnecessary-condition */
import "reflect-metadata";

import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { CourseByIdFinderErrors } from "../../contexts/mooc/courses/application/find-by-id/CourseByIdFinder";
import { container } from "../../contexts/shared/infrastructure/dependency-injection/diod.config";

import { CourseResourceTemplate } from "./courses/resources/CourseResourceTemplate";
import { CoursesResource } from "./courses/resources/CoursesResource";
import { PingTool } from "./ping/tools/PingTool";

const server = new McpServer({
	name: "codely-mcp-server",
	version: "1.0.0",
	capabilities: {
		resources: true,
		tools: true,
	},
});

const pingTool = new PingTool();
server.registerTool(
	pingTool.name,
	pingTool.description,
	pingTool.handler.bind(pingTool),
);

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
			const response = await courseDetailResource.handler(uri, params);

			return { contents: response.contents };
		} catch (error) {
			if (courseDetailResource.onError) {
				const response = courseDetailResource.onError(
					error as CourseByIdFinderErrors,
					uri,
					params,
				);

				return { contents: response.contents };
			}

			return {
				contents: [
					{
						uri: uri.href,
						mimeType: "application/json",
						text: JSON.stringify({
							error: {
								code: -32603,
								message: "Internal server error",
							},
						}),
					},
				],
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
