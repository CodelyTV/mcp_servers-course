import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpClient } from "../../../../contexts/shared/infrastructure/McpClient";

describe("CoursesResource MCP Integration", () => {
	const mcpClient = new McpClient("ts-node", "./src/app/mcp/server.ts");
	const courseRepository = container.get(CourseRepository);
	const connection = container.get(PostgresConnection);

	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("should list courses resource via MCP inspector", async () => {
		const resources = await mcpClient.listResources();

		expect(resources).toContain("courses://all");
	}, 10000);

	it("should list empty courses when there are not", async () => {
		const response = await mcpClient.readResource("courses://all");

		expect(response).toEqual({
			contents: [
				{
					uri: "courses://all",
					mimeType: "application/json",
					text: "[]",
				},
			],
		});
	});

	it("should list existing courses", async () => {
		const course = CourseMother.create();
		const anotherCourse = CourseMother.create();

		const courses = [course, anotherCourse];

		await Promise.all(
			courses.map((course) => courseRepository.save(course)),
		);

		const response = await mcpClient.readResource("courses://all");

		expect(response).toBe({
			contents: [
				{
					uri: "courses://all",
					mimeType: "application/json",
					text: '[{"id":"6XCP","name":"Orn and Sons","summary":"Totus provident totidem tamisium adeo cohaero. Magnam socius patruus degenero verbum speculum convoco tendo decimus. Civitas curtus audeo decet.","categories":["frontend","beginner"],"publishedAt":"2025-05-17T12:06:20.485Z"},{"id":"tPtD","name":"Wilkinson - Collier","summary":"Coaegresco ascit adnuo adversus. Iste perferendis subvenio cohibeo curto. Venustas tametsi tersus molestias beatae cometes tutamen auxilium auctor.","categories":["architecture","advanced"],"publishedAt":"2024-08-28T14:54:16.827Z"}]',
				},
			],
		});

});
