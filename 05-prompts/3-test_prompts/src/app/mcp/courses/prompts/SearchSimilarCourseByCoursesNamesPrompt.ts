import { Service } from "diod";
import * as z from "zod/v3";

import { CourseBySimilarNameFinder } from "../../../../contexts/mooc/courses/application/find-by-similar-name/CourseBySimilarNameFinder";
import { McpPrompt } from "../../../../contexts/shared/infrastructure/mcp/McpPrompt";
import { McpPromptResponse } from "../../../../contexts/shared/infrastructure/mcp/McpPromptResponse";

@Service()
export class SearchSimilarCourseByCoursesNamesPrompt implements McpPrompt {
	name = "courses-search_similar_by_names";
	title = "Find Courses with Similar Names";
	description =
		"Generate a prompt to search for a course similar to the courses submitted";

	inputSchema = {
		names: z.string(),
	};

	constructor(private readonly finder: CourseBySimilarNameFinder) {}

	async handler({ names }: { names: string }): Promise<McpPromptResponse> {
		const coursesPromises = names
			.split(",")
			.map((name) => this.finder.find(name));

		const courses = await Promise.all(coursesPromises);

		return McpPromptResponse.user(
			`Search for similar courses using the courses-search_similar_by_ids tool for these IDs: ${courses
				.map((course) => course.id)
				.join(", ")}`.trim(),
			`Find courses similar to ${courses.length} course(s) found`,
		);
	}
}
