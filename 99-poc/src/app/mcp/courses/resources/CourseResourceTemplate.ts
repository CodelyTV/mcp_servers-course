import { Service } from "diod";

import {
	CourseByIdFinderErrors,
	CourseFinder,
} from "../../../../contexts/mooc/courses/application/find/CourseFinder";
import { CourseNotFoundError } from "../../../../contexts/mooc/courses/domain/CourseNotFoundError";
import { assertNever } from "../../../../contexts/shared/domain/assertNever";
import { InvalidNanoIdError } from "../../../../contexts/shared/domain/InvalidNanoIdError";
import { McpResourceContentsResponse } from "../../../../contexts/shared/infrastructure/mcp/McpResourceContentsResponse";
import { McpResourceTemplate } from "../../../../contexts/shared/infrastructure/mcp/McpResourceTemplate";

@Service()
export class CourseResourceTemplate implements McpResourceTemplate {
	name = "course-detail";
	title = "Course Detail";
	description = "Get detailed information about a specific course by ID";
	uriTemplate = "courses://{id}";

	constructor(private readonly finder: CourseFinder) {}

	async handler(
		uri: URL,
		params: Record<string, string>,
	): Promise<McpResourceContentsResponse> {
		const courseId = params.id;

		if (!courseId || courseId.trim() === "") {
			return McpResourceContentsResponse.badRequest(
				uri.href,
				"Course ID is required",
			);
		}

		const course = await this.finder.find(courseId);

		return McpResourceContentsResponse.success(uri.href, course);
	}

	onError(
		error: CourseByIdFinderErrors,
		uri: URL,
		_params: Record<string, string>,
	): McpResourceContentsResponse {
		switch (true) {
			case error instanceof CourseNotFoundError:
				return McpResourceContentsResponse.notFound(
					uri.href,
					error.message,
				);
			case error instanceof InvalidNanoIdError:
				return McpResourceContentsResponse.badRequest(
					uri.href,
					"Invalid course ID format",
				);
			default:
				assertNever(error);
		}
	}
}
