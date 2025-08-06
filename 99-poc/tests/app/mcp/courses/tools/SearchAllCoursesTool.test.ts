import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpClient } from "../../../../contexts/shared/infrastructure/McpClient";

describe("SearchAllCoursesTool MCP Integration", () => {
	const mcpClient = new McpClient("ts-node", "./src/app/mcp/server.ts");
	const courseRepository = container.get(CourseRepository);
	const connection = container.get(PostgresConnection);

	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("should list search_all tool", async () => {
		const tools = await mcpClient.listTools();
		const toolNames = tools.map((tool) => tool.name);

		expect(toolNames).toContain("search_all");
	});

	it("should return empty list when calling the tool with no courses", async () => {
		const response = await mcpClient.callTool("search_all");

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
		});
	});

	it("should return existing courses when calling the tool", async () => {
		const course = CourseMother.createdToday();
		const anotherCourse = CourseMother.createdYesterday();
		const courses = [course, anotherCourse];

		await Promise.all(
			courses.map((course) => courseRepository.save(course)),
		);

		const response = await mcpClient.callTool("search_all");

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
		});
	});
});
