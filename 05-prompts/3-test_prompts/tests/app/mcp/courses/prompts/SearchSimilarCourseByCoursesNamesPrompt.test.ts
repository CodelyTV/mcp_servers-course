import "reflect-metadata";

import { Ollama } from "@langchain/ollama";
import { loadEvaluator } from "langchain/evaluation";

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

	it("return a valid prompt to search courses by similar names", async () => {
		const response = await mcpClient.getPrompt(
			"courses-search_similar_by_names",
			{ names: "Views,Cache" },
		);

		const prompt = response.firstPromptText();

		const evaluator = await loadEvaluator("criteria", {
			criteria: "relevance",
			llm: new Ollama({
				model: "gemma3",
				temperature: 0,
			}),
		});
	});
});
