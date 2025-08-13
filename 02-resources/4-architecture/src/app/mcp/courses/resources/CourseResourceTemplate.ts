import { Service } from "diod";

import { CourseFinder } from "../../../../contexts/mooc/courses/application/find/CourseFinder";
import { McpResourceResponse } from "../../../../contexts/shared/infrastructure/mcp/McpResourceResponse";
import { McpResourceTemplate } from "../../../../contexts/shared/infrastructure/mcp/McpResourceTemplate";

@Service()
export class CourseResourceTemplate implements McpResourceTemplate {
	name = "course-detail";
	title = "Course Detail";
	description = "Get detailed information about a specific course by id";
	uriTemplate = "courses://{id}" as const;

	constructor(private readonly finder: CourseFinder) {}

	async handler(
		uri: string,
		params: { id: string },
	): Promise<McpResourceResponse> {
		const course = await this.finder.find(params.id);

		return McpResourceResponse.success(uri, course);
	}
}
