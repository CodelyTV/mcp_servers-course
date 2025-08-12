import "reflect-metadata";

import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { execSync } from "child_process";

import { CourseFinder } from "../../contexts/mooc/courses/application/find/CourseFinder";
import { AllCoursesSearcher } from "../../contexts/mooc/courses/application/search-all/AllCoursesSearcher";
import { container } from "../../contexts/shared/infrastructure/dependency-injection/diod.config";

const server = new McpServer({
	name: "codely-mcp",
	version: "1.0.0",
	capabilities: {
		tools: true,
		resources: true,
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

const allCoursesSearcher = container.get(AllCoursesSearcher);
const courseFinder = container.get(CourseFinder);

server.registerResource(
	"courses",
	"courses://all",
	{
		title: "All Courses",
		description: "Complete list of all available courses",
	},
	async () => {
		const courses = await allCoursesSearcher.search();

		return {
			contents: [
				{
					uri: "courses://all",
					mimeType: "application/json",
					text: JSON.stringify(courses),
				},
			],
		};
	},
);

server.registerResource(
	"course",
	new ResourceTemplate("course://{id}", {
		list: undefined,
	}),
	{
		title: "Course by id",
		description: "Get a specific course by its id",
	},
	async (uri, params) => {
		const course = await courseFinder.find(params.id as string);

		return {
			contents: [
				{
					uri: uri.toString(),
					mimeType: "application/json",
					text: JSON.stringify(course),
				},
			],
		};
	},
);

async function main(): Promise<void> {
	const transport = new StdioServerTransport();

	await server.connect(transport);
}

main().catch((error) => {
	console.error("Server error:", error);

	process.exit(1);
});
