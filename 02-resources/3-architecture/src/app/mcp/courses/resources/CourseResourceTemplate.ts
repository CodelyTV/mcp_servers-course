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
		uri: string,
		params: { id: string },
	): Promise<McpResourceContentsResponse> {
		const course = await this.finder.find(params.id);

		return McpResourceContentsResponse.success(uri, course);
	}
}
