import "reflect-metadata";

import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { CourseMother } from "../../../../contexts/mooc/courses/domain/CourseMother";
import { McpClient } from "../../../../contexts/shared/infrastructure/McpClient";

describe("CoursesResource MCP Integration", () => {
	const mcpClient = new McpClient("./src/app/mcp/server.ts");
	const courseRepository = container.get(CourseRepository);

	beforeEach(async () => {
		const courses = CourseMother.codelyStyleCourses();

		await Promise.all(
			courses.map((course) => courseRepository.save(course)),
		);
	});

	it("should list courses resource via MCP inspector", async () => {
		const resources = await mcpClient.listResources();

		expect(resources).toContain("courses://all");
	}, 10000);
});
