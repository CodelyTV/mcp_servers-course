import "reflect-metadata";

import { McpTestClient } from "@codelytv/mcp-test-client";

describe("SearchSimilarCourseByCoursesNamesPrompt should", () => {
	const mcpClient = new McpTestClient("stdio", [
		"npx",
		"ts-node",
		"./src/app/mcp/server.ts",
	]);

	it("list the courses-search_similar_by_names prompt", async () => {
		const prompts = await mcpClient.listPrompts();

		expect(prompts.names()).toContain("courses-search_similar_by_names");
	});
});
