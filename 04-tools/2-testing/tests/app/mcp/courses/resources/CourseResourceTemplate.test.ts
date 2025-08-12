import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpClient } from "../../../../contexts/shared/infrastructure/McpClient";

describe("CourseResourceTemplate should", () => {
	const mcpClient = new McpClient(["ts-node", "./src/app/mcp/server.ts"]);
	const courseRepository = container.get(CourseRepository);
	const connection = container.get(PostgresConnection);

	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("be listed as an available resource template", async () => {
		const resourceTemplates = await mcpClient.listResourceTemplates();

		const courseDetailResourceTemplate = resourceTemplates.find(
			(template) => template.name === "course-detail",
		);

		expect(courseDetailResourceTemplate).toBeDefined();
		expect(courseDetailResourceTemplate?.uriTemplate).toBe(
			"courses://{id}",
		);
		expect(courseDetailResourceTemplate?.title).toBe("Course Detail");
		expect(courseDetailResourceTemplate?.description).toBe(
			"Get detailed information about a specific course by id",
		);
	});

	it("return course details when course exists", async () => {
		const course = CourseMother.createdToday();
		await courseRepository.save(course);

		const response = await mcpClient.readResource(
			`courses://${course.id.value}`,
		);

		expect(response).toEqual({
			contents: [
				{
					uri: `courses://${course.id.value}`,
					mimeType: "application/json",
					text: JSON.stringify(course.toPrimitives()),
				},
			],
		});
	});
});
