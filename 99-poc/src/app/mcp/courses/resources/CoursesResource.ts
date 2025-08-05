import { Service } from "diod";

import { AllCoursesSearcher } from "../../../../contexts/mooc/courses/application/search-all/AllCoursesSearcher";
import { McpResource } from "../../../../contexts/shared/infrastructure/mcp/McpResource";
import { McpResourceContentsResponse } from "../../../../contexts/shared/infrastructure/mcp/McpResourceContentsResponse";

@Service()
export class CoursesResource implements McpResource {
	name = "courses";
	title = "All Courses";
	description = "Complete list of all available courses";
	uriTemplate = "courses://all";

	constructor(private readonly searcher: AllCoursesSearcher) {}

	async handler(): Promise<McpResourceContentsResponse> {
		const courses = await this.searcher.search();

		return McpResourceContentsResponse.success(this.uriTemplate, courses);
	}
}
