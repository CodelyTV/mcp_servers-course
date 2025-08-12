import { Service } from "diod";

import { CourseFinder } from "../../../../contexts/mooc/courses/application/find/CourseFinder";
import { McpResourceContentsResponse } from "../../../../contexts/shared/infrastructure/mcp/McpResourceContentsResponse";
import { McpResourceTemplate } from "../../../../contexts/shared/infrastructure/mcp/McpResourceTemplate";

@Service()
export class CourseResourceTemplate implements McpResourceTemplate {
	name = "course-detail";
	title = "Course Detail";
	description = "Get detailed information about a specific course by id";
	uriTemplate = "courses://{id}";

	constructor(private readonly finder: CourseFinder) {}

	async handler(
		uri: URL,
		params: Record<string, string>,
	): Promise<McpResourceContentsResponse> {
		const courseId = params.id;

		const course = await this.finder.find(courseId);

		return McpResourceContentsResponse.success(uri.href, course);
	}
}
