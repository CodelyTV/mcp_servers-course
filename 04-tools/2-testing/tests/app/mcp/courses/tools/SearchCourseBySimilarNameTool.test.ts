import "reflect-metadata";

import { SearchCourseBySimilarNameTool } from "../../../../../src/app/mcp/courses/tools/SearchCourseBySimilarNameTool";
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

	it("tool works correctly when called directly", async () => {
		const searchCourseBySimilarNameTool = container.get(
			SearchCourseBySimilarNameTool,
		);
		const course = CourseMother.createdToday();
		await courseRepository.save(course);

		const response = await searchCourseBySimilarNameTool.handler({
			name: course.name,
		});

		expect(response.isError).toBe(false);
		expect(response.structuredContent).toEqual(course.toPrimitives());
	});
});
