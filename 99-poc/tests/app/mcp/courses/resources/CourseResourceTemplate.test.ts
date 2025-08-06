import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseIdMother } from "../../../../contexts/mooc/courses/domain/CourseIdMother";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpClient } from "../../../../contexts/shared/infrastructure/McpClient";

describe("CourseResourceTemplate MCP Integration", () => {
	const mcpClient = new McpClient("ts-node", "./src/app/mcp/server.ts");
	const courseRepository = container.get(CourseRepository);
	const connection = container.get(PostgresConnection);

	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("should return bad request error when course ID is invalid", async () => {
		const invalidId = "invalid-id";
		const response = await mcpClient.readResource(`courses://${invalidId}`);

		expect(response).toEqual({
			contents: [
				{
					uri: `courses://${invalidId}`,
					mimeType: "application/json",
					text: JSON.stringify({
						error: {
							code: -32000,
							message: "Invalid course ID format",
						},
					}),
				},
			],
		});
	});

	it("should return not found error when course does not exist", async () => {
		const nonExistentId = CourseIdMother.create().value;

		const response = await mcpClient.readResource(
			`courses://${nonExistentId}`,
		);

		expect(response).toEqual({
			contents: [
				{
					uri: `courses://${nonExistentId}`,
					mimeType: "application/json",
					text: JSON.stringify({
						error: {
							code: -32002,
							message: "CourseNotFoundError",
							data: {
								uri: `courses://${nonExistentId}`,
							},
						},
					}),
				},
			],
		});
	});

	it("should return course details when course exists", async () => {
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
