import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpInspectorCliClient } from "../../../../contexts/shared/infrastructure/mcp-inspector-cli-client/McpInspectorCliClient";

describe("SearchAllCoursesTool should", () => {
	const mcpClient = new McpInspectorCliClient([
		"ts-node",
		"./src/app/mcp/server.ts",
	]);
	const courseRepository = container.get(CourseRepository);
	const connection = container.get(PostgresConnection);

	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("list search all courses tool", async () => {
		const tools = await mcpClient.listTools();
		const toolNames = tools.map((tool) => tool.name);

		expect(toolNames).toContain("courses-search_all");
	});

	it("return empty when there are no courses", async () => {
		const response = await mcpClient.callTool("courses-search_all");

		expect(response).toEqual({
			content: [
				{
					type: "text",
					text: JSON.stringify({
						courses: [],
						total: 0,
					}),
				},
			],
			structuredContent: {
				courses: [],
				total: 0,
			},
			isError: false,
		});
	});

	it("return existing courses", async () => {
		const course = CourseMother.createdToday();
		const anotherCourse = CourseMother.createdYesterday();
		const courses = [course, anotherCourse];

		await Promise.all(
			courses.map((course) => courseRepository.save(course)),
		);

		const response = await mcpClient.callTool("courses-search_all");

		const expectedData = {
			courses: courses.map((course) => course.toPrimitives()),
			total: 2,
		};

		expect(response).toEqual({
			content: [
				{
					type: "text",
					text: JSON.stringify(expectedData),
				},
			],
			structuredContent: expectedData,
			isError: false,
		});
	});
});
