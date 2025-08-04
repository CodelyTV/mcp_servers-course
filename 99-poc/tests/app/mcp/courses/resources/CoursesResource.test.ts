import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpClient } from "../../../../contexts/shared/infrastructure/McpClient";

describe("CoursesResource MCP Integration", () => {
	const mcpClient = new McpClient("ts-node", "./src/app/mcp/server.ts");
	const courseRepository = container.get(CourseRepository);
	const connection = container.get(PostgresConnection);

	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("should list courses resource via MCP inspector", async () => {
		const resources = await mcpClient.listResources();

		expect(resources).toContain("courses://all");
	}, 10000);

	it("should list empty courses when there are not", async () => {
		const response = await mcpClient.readResource("courses://all");

		expect(response).toEqual({
			contents: [
				{
					uri: "courses://all",
					mimeType: "application/json",
					text: "[]",
				},
			],
		});
	});

	it("should list existing courses", async () => {
		const course = CourseMother.createdToday();
		const anotherCourse = CourseMother.createdYesterday();
		const courses = [course, anotherCourse];

		await Promise.all(
			courses.map((course) => courseRepository.save(course)),
		);

		const response = await mcpClient.readResource("courses://all");

		expect(response).toEqual({
			contents: [
				{
					uri: "courses://all",
					mimeType: "application/json",
					text: JSON.stringify(
						courses.map((course) => course.toPrimitives()),
					),
				},
			],
		});
	});
});
