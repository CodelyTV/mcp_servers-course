import { Service } from "diod";
import * as z from "zod/v3";

import { CourseBySimilarNameFinder } from "../../../../contexts/mooc/courses/application/find-by-similar-name/CourseBySimilarNameFinder";
import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";

@Service()
export class SearchCourseBySimilarNameTool implements McpTool {
	name = "courses-search_by_similar_name";
	title = "Search Course by similar name";
	description = "Search for a specific course by its similar name";
	inputSchema = { name: z.string() };

	constructor(private readonly finder: CourseBySimilarNameFinder) {}

	async handler({ name }: { name: string }): Promise<McpToolResponse> {
		try {
			const course = await this.finder.find(name);

			return McpToolResponse.structured(course);
		} catch (_error) {
			return McpToolResponse.error(
				`Course with similar name "${name}" not found`,
			);
		}
	}
}
