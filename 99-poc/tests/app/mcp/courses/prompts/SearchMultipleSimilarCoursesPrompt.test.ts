import "reflect-metadata";

import { SearchSimilarCourseByCoursesNamesPrompt } from "../../../../../src/app/mcp/courses/prompts/SearchSimilarCourseByCoursesNamesPrompt";
import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { McpClient } from "../../../../contexts/shared/infrastructure/McpClient";

describe("SearchMultipleSimilarCoursesPrompt should", () => {
	const mcpClient = new McpClient("ts-node", "./src/app/mcp/server.ts");
	const courseRepository = container.get(CourseRepository);
	const connection = container.get(PostgresConnection);
	const prompt = container.get(SearchSimilarCourseByCoursesNamesPrompt);

	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("list search multiple similar courses prompt", async () => {
		const prompts = await mcpClient.listPrompts();
		const promptNames = prompts.map((prompt) => prompt.name);

		expect(promptNames).toContain("search-multiple-similar-courses");
	});

	it("return error message when no course IDs provided", async () => {
		const response = await mcpClient.getPrompt(
			"search-multiple-similar-courses",
			{},
		);

		expect(response.description).toBe(
			"Please provide course IDs to search for similar courses",
		);
		expect(response.messages).toHaveLength(1);
		expect(response.messages[0].role).toBe("user");
		expect(response.messages[0].content.text).toContain(
			"You need to provide at least one course ID",
		);
	});

	it("return error message when empty course IDs provided", async () => {
		const response = await mcpClient.getPrompt(
			"search-multiple-similar-courses",
			{ ids: "" },
		);

		expect(response.description).toBe(
			"Please provide course IDs to search for similar courses",
		);
		expect(response.messages).toHaveLength(1);
		expect(response.messages[0].role).toBe("user");
		expect(response.messages[0].content.text).toContain(
			"You need to provide at least one course ID",
		);
	});
});
