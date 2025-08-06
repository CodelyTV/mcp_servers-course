import { Service } from "diod";

import { CourseByIdFinder } from "../../../../contexts/mooc/courses/application/find-by-id/CourseByIdFinder";
import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";

@Service()
export class SearchCourseByIdTool implements McpTool {
	name = "courses-search_by_id";
	title = "Search Course by ID";
	description = "Search for a specific course by its ID";
	inputSchema = {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "The course ID to search for",
			},
		},
		required: ["id"],
	};

	constructor(private readonly finder: CourseByIdFinder) {}

	async handler(args: { id: string }): Promise<McpToolResponse> {
		try {
			const course = await this.finder.find(args.id);

			return McpToolResponse.structured(course.toPrimitives());
		} catch (error) {
			return McpToolResponse.error(`Course with id ${args.id} not found`);
		}
	}
}