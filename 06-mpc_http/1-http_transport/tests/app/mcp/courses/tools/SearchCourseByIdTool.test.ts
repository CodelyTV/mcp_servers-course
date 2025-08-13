import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseIdMother } from "../../../../contexts/mooc/courses/domain/CourseIdMother";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpInspectorCliClient } from "../../../../contexts/shared/infrastructure/mcp-inspector-cli-client/McpInspectorCliClient";

describe("SearchCourseByIdTool should", () => {
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

	it("list search course by id tool", async () => {
		const toolsResponse = await mcpClient.listTools();

		expect(toolsResponse.names()).toContain("courses-search_by_id");
	});

	it("return error when course is not found", async () => {
		const nonExistingCourseId = CourseIdMother.create().value;

		const response = await mcpClient.callTool("courses-search_by_id", {
			id: nonExistingCourseId,
		});

		expect(response.toPrimitives()).toEqual({
			content: [
				{
					type: "text",
					text: `Course with id ${nonExistingCourseId} not found`,
				},
			],
			structuredContent: undefined,
			isError: true,
		});
	});

	it("return existing course", async () => {
		const course = CourseMother.createdToday();
		await courseRepository.save(course);

		const response = await mcpClient.callTool("courses-search_by_id", {
			id: course.id.value,
		});

		const expectedData = course.toPrimitives();

		expect(response.toPrimitives()).toEqual({
			content: [
				expect.objectContaining({
					type: "text",
					text: JSON.stringify(expectedData),
				}),
			],
			structuredContent: expectedData,
			isError: false,
		});
	});
});
