/* eslint-disable @typescript-eslint/explicit-function-return-type */
import "reflect-metadata";

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { CodelyError } from "../../contexts/shared/domain/CodelyError";

import { CourseResourceTemplate } from "./courses/resources/CourseResourceTemplate";
import { CoursesResource } from "./courses/resources/CoursesResource";
import { PingTool } from "./ping/tools/PingTool";

const server = new McpServer({
	name: "codely-mcp-server",
	version: "1.0.0",
});

const pingTool = new PingTool();
server.registerTool(
	pingTool.name,
	pingTool.description,
	pingTool.handler.bind(pingTool),
);

const coursesResource = new CoursesResource();
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

const courseDetailResource = new CourseResourceTemplate();
server.registerResource(
	courseDetailResource.name,
	new ResourceTemplate(courseDetailResource.uriTemplate, { 
		list: async () => ({ resources: [] }) 
	}),
	{
		title: courseDetailResource.title,
		description: courseDetailResource.description,
	},
	async (uri, params) => {
		try {
			const response = await courseDetailResource.handle(uri, params);

			return { contents: response.contents };
		} catch (error) {
			console.error("Error caught:", error, "Is CodelyError:", error instanceof CodelyError);
			if (error instanceof CodelyError && courseDetailResource.onError) {
				const response = courseDetailResource.onError(
					error,
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
