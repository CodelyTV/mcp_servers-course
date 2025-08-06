import { Service } from "diod";
import * as z from "zod/v3";

import { CourseByIdFinder } from "../../../../contexts/mooc/courses/application/find/CourseByIdFinder";
import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";

@Service()
export class SearchCourseByIdTool implements McpTool {
	name = "courses-search_by_id";
	title = "Search Course by ID";
	description = "Search for a specific course by its ID";
	inputSchema = { id: z.string() };

	constructor(private readonly finder: CourseByIdFinder) {}

	async handler({ id }: { id: string }): Promise<McpToolResponse> {
		try {
			const course = await this.finder.find(id);

			return McpToolResponse.structured(course.toPrimitives());
		} catch (_error) {
			return McpToolResponse.error(`Course with id ${id} not found`);
		}
	}
}
