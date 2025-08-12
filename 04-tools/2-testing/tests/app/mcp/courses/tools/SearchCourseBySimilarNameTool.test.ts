import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpInspectorCliClient } from "../../../../contexts/shared/infrastructure/mcp-inspector-cli-client/McpInspectorCliClient";

describe("SearchCourseBySimilarNameTool should", () => {
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

	it("list search course by similar name tool", async () => {
		const toolsResponse = await mcpClient.listTools();
		const toolNames = toolsResponse.names();

		expect(toolNames).toContain("courses-search_by_similar_name");
	});

	it("return existing course", async () => {
		const course = CourseMother.createdToday();
		await courseRepository.save(course);

		const response = await mcpClient.callTool(
			"courses-search_by_similar_name",
			{
				name: course.name,
			},
		);

		const expectedData = course.toPrimitives();

		expect(response.toPrimitives()).toEqual({
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
