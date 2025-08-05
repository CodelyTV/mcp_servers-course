import { Service } from "diod";

import { AllCoursesSearcher } from "../../../../contexts/mooc/courses/application/search-all/AllCoursesSearcher";
import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";

@Service()
export class SearchAllCoursesTool implements McpTool {
	name = "search_all";
	title = "List All Courses";
	description = "Returns a complete list of all available courses";
	inputSchema = {};

	constructor(private readonly searcher: AllCoursesSearcher) {}

	async handler(): Promise<{
		content: Array<{
			type: "text";
			text: string;
		}>;
		structuredContent?: Record<string, unknown>;
		isError?: boolean;
	}> {
		const courses = await this.searcher.search();

		const coursesText = courses
			.map((course) => `- ${course.name} (ID: ${course.id})`)
			.join("\n");

		const response = McpToolResponse.text(
			`Available Courses:\n\n${coursesText}`,
		);

		return {
			content: response.content as Array<{ type: "text"; text: string }>,
			structuredContent: {
				courses,
				total: courses.length,
			},
		};
	}
}
