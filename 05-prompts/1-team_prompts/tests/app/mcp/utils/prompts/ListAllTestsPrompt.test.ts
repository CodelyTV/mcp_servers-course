import "reflect-metadata";

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

		expect(response.toPrimitives()).toEqual({
			messages: [
				{
					role: "user",
					content: {
						type: "text",
						text: `
			List all tests and test case inside the /tests folder. The format should be:
			🧪 Test "describe" content
			  - ✅ Test case name
			  - …
			`.trim(),
					},
				},
			],
		});
	});
});
