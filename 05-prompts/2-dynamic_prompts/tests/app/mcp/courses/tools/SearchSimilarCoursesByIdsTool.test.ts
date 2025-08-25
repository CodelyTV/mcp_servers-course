import "reflect-metadata";

import { McpTestClient } from "@codelytv/mcp-test-client";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";

describe("SearchSimilarCoursesByIdsTool should", () => {
	const mcpClient = new McpTestClient("stdio", [
		"npx",
		"ts-node",
		"./src/app/mcp/server.ts",
	]);
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

	it("list search similar courses by ids tool", async () => {
		const toolsResponse = await mcpClient.listTools();

		expect(toolsResponse.names()).toContain(
			"courses-search_similar_by_ids",
		);
	});

	it("return empty when no similar courses found", async () => {
		const course = CourseMother.create();
		await courseRepository.save(course);

		const response = await mcpClient.callTool(
			"courses-search_similar_by_ids",
			{
				ids: [course.id.value],
			},
		);

		const expectedData = {
			courses: [],
			total: 0,
			searchedIds: [course.id.value],
		};

		expect(response.toPrimitives()).toEqual({
			content: [
				{
					type: "text",
					text: JSON.stringify(expectedData),
				},
			],
			structuredContent: expectedData,
			isError: false,
		});
	});

	it("return similar courses when found", async () => {
		const jsCourse = CourseMother.create({
			name: "Advanced JavaScript",
		});
		const tsCourse = CourseMother.create({
			name: "Advanced TypeScript",
		});
		const extremeTsCourse = CourseMother.create({
			name: "Extreme TypeScript",
		});

		await courseRepository.save(jsCourse);
		await courseRepository.save(tsCourse);
		await courseRepository.save(extremeTsCourse);

		const response = await mcpClient.callTool(
			"courses-search_similar_by_ids",
			{
				ids: [jsCourse.id.value, tsCourse.id.value],
			},
		);

		const expectedData = {
			courses: [extremeTsCourse.toPrimitives()],
			total: 1,
			searchedIds: [jsCourse.id.value, tsCourse.id.value],
		};

		expect(response.toPrimitives()).toEqual({
			content: [
				{
					type: "text",
					text: JSON.stringify(expectedData),
				},
			],
			structuredContent: expectedData,
			isError: false,
		});
	});
});
