import "reflect-metadata";

import { SearchCourseBySimilarNameTool } from "../../../../../src/app/mcp/courses/tools/SearchCourseBySimilarNameTool";
import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpClient } from "../../../../contexts/shared/infrastructure/McpClient";

describe("SearchCourseBySimilarNameTool should", () => {
	const mcpClient = new McpClient("ts-node", "./src/app/mcp/server.ts");
	const courseRepository = container.get(CourseRepository);
	const connection = container.get(PostgresConnection);

	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("list search course by similar name tool", async () => {
		const tools = await mcpClient.listTools();
		const toolNames = tools.map((tool) => tool.name);

		expect(toolNames).toContain("courses-search_by_similar_name");
	});

	it("return error when no name is provided via CLI", async () => {
		// Test via CLI without arguments - should show error message
		const response = await mcpClient.callTool(
			"courses-search_by_similar_name",
		);

		expect(response.isError).toBe(true);
		expect(response.content[0].text).toContain(
			"Error: name parameter is required",
		);
	});

	it("tool works correctly when called directly", async () => {
		// Test the tool directly to verify it works with proper arguments
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
