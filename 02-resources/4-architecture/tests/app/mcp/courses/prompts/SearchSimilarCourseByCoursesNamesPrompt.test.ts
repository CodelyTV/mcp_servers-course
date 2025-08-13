import "reflect-metadata";

import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { McpClient } from "../../../../contexts/shared/infrastructure/McpClient";

describe("SearchSimilarCourseByCoursesNamesPrompt should", () => {
	const mcpClient = new McpClient("ts-node", "./src/app/mcp/server.ts");
	const connection = container.get(PostgresConnection);

	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("list search multiple similar courses prompt", async () => {
		const prompts = await mcpClient.listPrompts();
		const promptNames = prompts.map((prompt) => prompt.name);

		expect(promptNames).toContain("courses-search_similar_by_names");
	});

	it("return error message when no course names provided", async () => {
		const response = await mcpClient.getPrompt(
			"courses-search_similar_by_names",
			{},
		);

		expect(response.description).toBe(
			"Por favor proporciona nombres de cursos para buscar cursos similares",
		);
		expect(response.messages).toHaveLength(1);
		expect(response.messages[0].role).toBe("user");
		expect(response.messages[0].content.text).toContain(
			"Necesitas proporcionar nombres de cursos para encontrar cursos similares",
		);
	});

	it("return error message when empty course names provided", async () => {
		const response = await mcpClient.getPrompt(
			"courses-search_similar_by_names",
			{ names: "" },
		);

		expect(response.description).toBe(
			"Por favor proporciona nombres de cursos para buscar cursos similares",
		);
		expect(response.messages).toHaveLength(1);
		expect(response.messages[0].role).toBe("user");
		expect(response.messages[0].content.text).toContain(
			"Necesitas proporcionar nombres de cursos para encontrar cursos similares",
		);
	});
});
