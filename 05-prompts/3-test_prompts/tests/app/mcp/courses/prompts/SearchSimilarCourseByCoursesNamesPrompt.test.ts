import "reflect-metadata";

import { Ollama } from "@langchain/ollama";
import { loadEvaluator } from "langchain/evaluation";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpInspectorCliClient } from "../../../../contexts/shared/infrastructure/mcp-inspector-cli-client/McpInspectorCliClient";

const courseRepository = container.get(CourseRepository);
const connection = container.get(PostgresConnection);

beforeEach(async () => {
	await connection.truncateAll();
});

afterAll(async () => {
	await connection.end();
});

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
		const cacheCourse = CourseMother.create({
			name: `Infrastructure design: Cache`,
		});
		const viewsCourse = CourseMother.create({
			name: `Infrastructure design: Views`,
		});
		const kafkaCourse = CourseMother.create({
			name: `Infrastructure design: Kafka`,
		});
		const courses = [cacheCourse, viewsCourse, kafkaCourse];
		await Promise.all(
			courses.map((course) => courseRepository.save(course)),
		);

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

		const evaluation = await evaluator.evaluateStrings({
			input: `Prompt that incites to use the courses-search_similar_by_ids tool passing course ids`,
			prediction: prompt,
		});

		expect(evaluation.score).toBeGreaterThan(0.7);
		expect(prompt).toContain(viewsCourse.id.value);
		expect(prompt).toContain(cacheCourse.id.value);
	});
});
