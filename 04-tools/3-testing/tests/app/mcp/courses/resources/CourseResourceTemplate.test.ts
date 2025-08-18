import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpTestClient } from "../../../../contexts/shared/infrastructure/mcp-inspector-cli-client/McpTestClient";

describe("CourseResourceTemplate should", () => {
	const mcpClient = new McpTestClient([
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

	it("be listed as an available resource template", async () => {
		const resourceTemplates = await mcpClient.listResourceTemplates();

		expect(resourceTemplates.uris()).toContain("courses://{id}");
	});

	it("return course details when course exists", async () => {
		const course = CourseMother.createdToday();

		await courseRepository.save(course);

		const response = await mcpClient.readResource(
			`courses://${course.id.value}`,
		);

		expect(response.toPrimitives()).toEqual({
			contents: [
				{
					uri: `courses://${course.id.value}`,
					mimeType: "application/json",
					text: JSON.stringify(course.toPrimitives()),
				},
			],
		});
	});

	it("list all available courses as resources", async () => {
		const course1 = CourseMother.createdToday();
		const course2 = CourseMother.createdToday();

		await courseRepository.save(course1);
		await courseRepository.save(course2);

		const response = await mcpClient.listResources();

		expect(response.uris()).toBe([
			`course://all`,
			`course://${course1.id.value}`,
			`course://${course2.id.value}`,
		]);
	});
});
