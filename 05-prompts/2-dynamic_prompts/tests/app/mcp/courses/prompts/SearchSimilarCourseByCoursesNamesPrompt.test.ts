import "reflect-metadata";

import { McpClient } from "@codelytv/mcp-client";

describe("SearchSimilarCourseByCoursesNamesPrompt should", () => {
	const mcpClient = new McpClient("stdio", [
		"npx",
		"ts-node",
		"./src/app/mcp/server.ts",
	]);

	beforeAll(async () => {
		await mcpClient.connect();
	});

	afterAll(async () => {
		await mcpClient.disconnect();
	});

	it("list the courses-search_similar_by_names prompt", async () => {
		const prompts = await mcpClient.listPrompts();

		expect(prompts.names()).toContain("courses-search_similar_by_names");
	});
});
