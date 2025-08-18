import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpTestClient } from "../../../../contexts/shared/infrastructure/mcp-test-client/McpTestClient";

describe("CoursesResource should", () => {
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

	it("list courses resource", async () => {
		const resources = await mcpClient.listResources();

		expect(resources.uris()).toContain("courses://all");
	});

	it("return empty when there are no courses", async () => {
		const response = await mcpClient.readResource("courses://all");

		expect(response.toPrimitives()).toEqual({
			contents: [
				{
					uri: "courses://all",
					mimeType: "application/json",
					text: "[]",
				},
			],
		});
	});

	it("return existing courses", async () => {
		const course = CourseMother.createdToday();
		const anotherCourse = CourseMother.createdYesterday();
		const courses = [course, anotherCourse];

		await Promise.all(
			courses.map((course) => courseRepository.save(course)),
		);

		const response = await mcpClient.readResource("courses://all");

		expect(response.toPrimitives()).toEqual({
			contents: [
				{
					uri: "courses://all",
					mimeType: "application/json",
					text: JSON.stringify(
						courses.map((course) => course.toPrimitives()),
					),
				},
			],
		});
	});
});
