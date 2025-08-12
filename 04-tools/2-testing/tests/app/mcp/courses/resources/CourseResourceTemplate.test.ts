import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpInspectorCliClient } from "../../../../contexts/shared/infrastructure/mcp-inspector-cli-client/McpInspectorCliClient";

describe("CourseResourceTemplate should", () => {
	const mcpClient = new McpInspectorCliClient([
		"ts-node",
		"./src/app/mcp/server.ts",
	]);
	const courseRepository = container.get(CourseRepository);
	const connection = container.get(PostgresConnection);

	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("be listed as an available resource template", async () => {
		const resourceTemplateUris = await mcpClient.listResourceTemplateUris();

		expect(resourceTemplateUris).toContain("courses://{id}");
	});

	it("return course details when course exists", async () => {
		const course = CourseMother.createdToday();
		await courseRepository.save(course);

		const response = await mcpClient.readResource(
			`courses://${course.id.value}`,
		);

		expect(response).toEqual({
			contents: [
				{
					uri: `courses://${course.id.value}`,
					mimeType: "application/json",
					text: JSON.stringify(course.toPrimitives()),
				},
			],
		});
	});
});
