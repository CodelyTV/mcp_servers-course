import "reflect-metadata";

import { McpInspectorCliClient } from "../../../../contexts/shared/infrastructure/mcp-inspector-cli-client/McpInspectorCliClient";

describe("SearchSimilarCourseByCoursesNamesPrompt should", () => {
	const mcpClient = new McpInspectorCliClient([
		"npx",
		"ts-node",
		"./src/app/mcp/server.ts",
	]);

	it("list the courses-search_similar_by_names prompt", async () => {
		const prompts = await mcpClient.listPrompts();

		expect(prompts.names()).toContain("courses-search_similar_by_names");
	});
});
