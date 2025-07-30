/* eslint-disable @typescript-eslint/explicit-function-return-type */
import "reflect-metadata";

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { CourseDetailResource } from "./courses/resources/CourseDetailResource";
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
	coursesResource.handler.bind(coursesResource),
);

const courseDetailResource = new CourseDetailResource();
server.registerResource(
	courseDetailResource.name,
	new ResourceTemplate(courseDetailResource.uriTemplate, { list: undefined }),
	{
		title: courseDetailResource.title,
		description: courseDetailResource.description,
	},
	async (uri, variables) => {
		return courseDetailResource.handlerWithVariables(uri, variables);
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
