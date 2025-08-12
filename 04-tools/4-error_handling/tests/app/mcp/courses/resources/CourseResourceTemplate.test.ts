import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseIdMother } from "../../../../contexts/mooc/courses/domain/CourseIdMother";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpInspectorCliClient } from "../../../../contexts/shared/infrastructure/mcp-inspector-cli-client/McpInspectorCliClient";

describe("CourseResourceTemplate should", () => {
	const mcpClient = new McpInspectorCliClient([
		"npx",
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

	it("be listed as an available resource template", async () => {
		const resourceTemplates = await mcpClient.listResourceTemplates();

		expect(resourceTemplates.uris()).toContain("courses://{id}");
	});

	it("return bad request error when course id is invalid", async () => {
		const invalidId = CourseIdMother.invalid();

		await expect(
			mcpClient.readResource(`courses://${invalidId}`),
		).rejects.toThrow(
			`Process exited with code 1: Failed to read resource courses://${invalidId}: MCP error -32000: The id <${invalidId}> is not a valid nano id`,
		);
	});

	it("return not found error when course is not found", async () => {
		const nonExistingCourseId = CourseIdMother.create().value;

		await expect(
			mcpClient.readResource(`courses://${nonExistingCourseId}`),
		).rejects.toThrow(
			`Process exited with code 1: Failed to read resource courses://${nonExistingCourseId}: MCP error -32002: The course <${nonExistingCourseId}> has not been found`,
		);
	});

	it("return course details when course exists", async () => {
		const course = CourseMother.createdToday();

		await courseRepository.save(course);

		const response = await mcpClient.readResource(
			`courses://${course.id.value}`,
		);

		expect(response.toPrimitives()).toEqual({
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
