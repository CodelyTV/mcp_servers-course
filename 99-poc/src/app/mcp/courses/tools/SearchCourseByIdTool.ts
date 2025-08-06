import { Service } from "diod";
import * as z from "zod/v3";

import { CourseFinder } from "../../../../contexts/mooc/courses/application/find/CourseFinder";
import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";

@Service()
export class SearchCourseByIdTool implements McpTool {
	name = "courses-search_by_id";
	title = "Search Course by id";
	description = "Search for a specific course by its id";
	inputSchema = { id: z.string() };

	constructor(private readonly finder: CourseFinder) {}

	async handler({ id }: { id: string }): Promise<McpToolResponse> {
		try {
			const course = await this.finder.find(id);

			return McpToolResponse.structured(course.toPrimitives());
		} catch (_error) {
			return McpToolResponse.error(`Course with id ${id} not found`);
		}
	}
}
