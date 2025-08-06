import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpClient } from "../../../../contexts/shared/infrastructure/McpClient";

describe("SearchCourseByIdTool should", () => {
	const mcpClient = new McpClient("ts-node", "./src/app/mcp/server.ts");
	const courseRepository = container.get(CourseRepository);
	const connection = container.get(PostgresConnection);

	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("list search course by id tool", async () => {
		const tools = await mcpClient.listTools();
		const toolNames = tools.map((tool) => tool.name);

		expect(toolNames).toContain("courses-search_by_id");
	});

	it("return error when course id is not provided", async () => {
		const response = await mcpClient.callTool("courses-search_by_id", {});

		expect(response).toEqual({
			content: [
				{
					type: "text",
					text: "Course ID is required",
				},
			],
		});
	});

	it("return error when course id is empty", async () => {
		const response = await mcpClient.callTool("courses-search_by_id", {
			id: "",
		});

		expect(response).toEqual({
			content: [
				{
					type: "text",
					text: "Course ID is required",
				},
			],
		});
	});

	it("return error when course does not exist", async () => {
		const nonExistentId = "non-existent-id";
		const response = await mcpClient.callTool("courses-search_by_id", {
			id: nonExistentId,
		});

		expect(response).toEqual({
			content: [
				{
					type: "text",
					text: expect.stringContaining("Course not found"),
				},
			],
		});
	});

	it("return error when course id format is invalid", async () => {
		const invalidId = "invalid!@#$%^&*()";
		const response = await mcpClient.callTool("courses-search_by_id", {
			id: invalidId,
		});

		expect(response).toEqual({
			content: [
				{
					type: "text",
					text: "Invalid course ID format",
				},
			],
		});
	});

	it("return existing course by id", async () => {
		const course = CourseMother.createdToday();
		await courseRepository.save(course);

		const response = await mcpClient.callTool("courses-search_by_id", {
			id: course.id.value,
		});

		const expectedData = {
			course: course.toPrimitives(),
		};

		expect(response).toEqual({
			content: [
				{
					type: "text",
					text: JSON.stringify(expectedData),
				},
			],
			structuredContent: expectedData,
		});
	});

	it("return only the requested course when multiple courses exist", async () => {
		const targetCourse = CourseMother.createdToday();
		const otherCourse = CourseMother.createdYesterday();

		await courseRepository.save(targetCourse);
		await courseRepository.save(otherCourse);

		const response = await mcpClient.callTool("courses-search_by_id", {
			id: targetCourse.id.value,
		});

		const expectedData = {
			course: targetCourse.toPrimitives(),
		};

		expect(response).toEqual({
			content: [
				{
					type: "text",
					text: JSON.stringify(expectedData),
				},
			],
			structuredContent: expectedData,
		});
	});
});
