import "reflect-metadata";

import { McpClient } from "@codelytv/mcp-client";

import { evaluatePrompt } from "../../../contexts/shared/infrastructure/evaluatePrompt";

describe("GenerateAggregateBlueprintMcpPrompt should", () => {
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

	it("list the software_architecture-generate_aggregate_blueprint prompt", async () => {
		const prompts = await mcpClient.listPrompts();

		expect(prompts.names()).toContain(
			"software_architecture-generate_codely_aggregate_design_blueprint",
		);
	});

	it("return a prompt to generate code from aggregate blueprint", async () => {
		const response = await mcpClient.getPrompt(
			"software_architecture-generate_codely_aggregate_design_blueprint",
			{
				name: "User",
				description: "A user in the system",
				context: "shared",
				properties: "id, email, name",
				enforcedInvariants: "Email must be valid, Name cannot be empty",
				correctivePolicies:
					"Send validation email when invalid email provided",
				domainEvents: "UserRegistered, UserUpdated",
				waysToAccess: "by id, by email",
			},
		);

		const score = await evaluatePrompt(
			`The prompt should provide instructions to transform an aggregate design blueprint into code following DDD patterns and hexagonal architecture`,
			response.firstPromptText(),
		);

		expect(score).toBeGreaterThan(0.5);
	}, 30000);
});
