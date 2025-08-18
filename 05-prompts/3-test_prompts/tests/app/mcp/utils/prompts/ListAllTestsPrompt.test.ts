import "reflect-metadata";

import { evaluatePrompt } from "../../../../contexts/shared/infrastructure/evaluatePrompt";
import { McpInspectorCliClient } from "../../../../contexts/shared/infrastructure/mcp-inspector-cli-client/McpInspectorCliClient";

describe("ListAllTestsPrompt should", () => {
	const mcpClient = new McpInspectorCliClient([
		"npx",
		"ts-node",
		"./src/app/mcp/server.ts",
	]);

	it("list the utils-list_all_tests prompt", async () => {
		const prompts = await mcpClient.listPrompts();

		expect(prompts.names()).toContain("utils-list_all_tests");
	});

	it("return a user message with instructions to list all tests", async () => {
		const response = await mcpClient.getPrompt("utils-list_all_tests");

		const score = await evaluatePrompt(
			`The prompt should guide how to list all tests and test cases inside the test folder using emojis`,
			response.firstPromptText(),
		);

		expect(score).toBeGreaterThan(0.7);
	}, 20000);
});
