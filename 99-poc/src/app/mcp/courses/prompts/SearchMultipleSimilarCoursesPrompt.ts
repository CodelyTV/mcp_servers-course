import { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";
import { Service } from "diod";
import * as z from "zod/v3";

import { CoursesByIdsSearcher } from "../../../../contexts/mooc/courses/application/search-by-ids/CoursesByIdsSearcher";
import { McpPrompt } from "../../../../contexts/shared/infrastructure/mcp/McpPrompt";

@Service()
export class SearchMultipleSimilarCoursesPrompt implements McpPrompt {
	name = "search-multiple-similar-courses";
	title = "Search Multiple Similar Courses";
	description =
		"Generate a prompt to search for courses similar to multiple given course IDs";

	argsSchema = { ids: z.string().optional() };

	constructor(private readonly searcher: CoursesByIdsSearcher) {}

	async handler(args?: { ids?: string }): Promise<GetPromptResult> {
		const ids =
			args?.ids
				?.split(",")
				.map((id) => id.trim())
				.filter((id) => id.length > 0) ?? [];

		if (ids.length === 0) {
			return {
				description:
					"Please provide course IDs to search for similar courses",
				messages: [
					{
						role: "user",
						content: {
							type: "text",
							text: "You need to provide at least one course ID to find similar courses. Use the format: ids=course1,course2,course3",
						},
					},
				],
			};
		}

		try {
			const courses = await this.searcher.search(ids);

			const courseList = courses
				.map((course) => `- ${course.name} (ID: ${course.id})`)
				.join("\n");

			return {
				description: `Search for courses similar to the ${ids.length} provided course(s)`,
				messages: [
					{
						role: "user",
						content: {
							type: "text",
							text: `I want to find courses similar to these ${ids.length} course(s):\n\nCourses found:\n${courseList}\n\nPlease help me find courses that are similar to these in topic, difficulty, or content.`,
						},
					},
				],
			};
		} catch (error) {
			return {
				description: "Error searching for similar courses",
				messages: [
					{
						role: "user",
						content: {
							type: "text",
							text: `There was an error searching for similar courses: ${error instanceof Error ? error.message : "Unknown error"}`,
						},
					},
				],
			};
		}
	}
}
