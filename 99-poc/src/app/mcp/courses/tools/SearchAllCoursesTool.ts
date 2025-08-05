import { Service } from "diod";

import { AllCoursesSearcher } from "../../../../contexts/mooc/courses/application/search-all/AllCoursesSearcher";
import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";

@Service()
export class SearchAllCoursesTool implements McpTool {
	name = "search_all";
	description = {
		title: "List All Courses",
		description: "Returns a complete list of all available courses",
		inputSchema: {},
	};

	constructor(private readonly searcher: AllCoursesSearcher) {}

	async handler() {
		const courses = await this.searcher.search();

		const coursesText = courses
			.map((course) => `- ${course.name} (ID: ${course.id})`)
			.join("\n");

		return {
			content: [
				{
					type: "text" as const,
					text: `Available Courses:\n\n${coursesText}`,
				},
			],
			structuredContent: {
				courses: courses,
				total: courses.length,
			},
		};
	}
}
