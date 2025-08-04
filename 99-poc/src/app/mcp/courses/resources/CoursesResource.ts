import { AllCoursesSearcher } from "../../../../contexts/mooc/courses/application/search-all/AllCoursesSearcher";
import { container } from "../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { McpResource } from "../../../../contexts/shared/infrastructure/mcp/McpResource";
import { McpResourceContentsResponse } from "../../../../contexts/shared/infrastructure/mcp/McpResourceContentsResponse";

export class CoursesResource implements McpResource {
	name = "courses";
	title = "All Courses";
	description = "Complete list of all available courses";
	uriTemplate = "courses://all";

	async handler(): Promise<McpResourceContentsResponse> {
		const coursesSearcher = container.get(AllCoursesSearcher);
		const courses = await coursesSearcher.search();

		return McpResourceContentsResponse.success(this.uriTemplate, courses);
	}
}
