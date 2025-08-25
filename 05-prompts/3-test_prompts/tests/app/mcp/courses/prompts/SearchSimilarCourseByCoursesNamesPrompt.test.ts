import "reflect-metadata";

import { McpTestClient } from "@codelytv/mcp-test-client";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { evaluatePrompt } from "../../../../contexts/shared/infrastructure/evaluatePrompt";

const courseRepository = container.get(CourseRepository);
const connection = container.get(PostgresConnection);

beforeAll(async () => {
	await mcpClient.connect();
});

beforeEach(async () => {
	await connection.truncateAll();
});

afterAll(async () => {
	await mcpClient.disconnect();
	await connection.end();
});

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

		const score = await evaluatePrompt(
			'The prompt should instruct to use the "courses-search_similar_by_ids" tool with course IDs',
			prompt,
		);

		expect(score).toBeGreaterThan(0.7);
		expect(prompt).toContain("courses-search_similar_by_ids");
		expect(prompt).toContain(viewsCourse.id.value);
		expect(prompt).toContain(cacheCourse.id.value);
	}, 20000);
});
