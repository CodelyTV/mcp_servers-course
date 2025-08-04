import { CourseByIdFinder } from "../../../../contexts/mooc/courses/application/find-by-id/CourseByIdFinder";
import { CourseNotFoundError } from "../../../../contexts/mooc/courses/domain/CourseNotFoundError";
import { CodelyError } from "../../../../contexts/shared/domain/CodelyError";
import { container } from "../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { McpResourceContentsResponse } from "../../../../contexts/shared/infrastructure/mcp/McpResourceContentsResponse";
import { McpResourceTemplate } from "../../../../contexts/shared/infrastructure/mcp/McpResourceTemplate";

export class CourseResourceTemplate implements McpResourceTemplate {
	name = "course-detail";
	title = "Course Detail";
	description = "Get detailed information about a specific course by ID";
	uriTemplate = "courses://{id}";

	async handle(
		uri: URL,
		params: Record<string, string | string[]>,
	): Promise<McpResourceContentsResponse> {
		const courseId = Array.isArray(params.id) ? params.id[0] : params.id;

		if (!courseId || courseId.trim() === "") {
			return McpResourceContentsResponse.badRequest(
				uri.href,
				"Course ID is required",
			);
		}

		const courseByIdFinder = container.get(CourseByIdFinder);
		const course = await courseByIdFinder.find(courseId);

		return McpResourceContentsResponse.success(
			uri.href,
			course.toPrimitives(),
		);
	}

	onError(
		error: CodelyError,
		uri: URL,
		_params: Record<string, string | string[]>,
	): McpResourceContentsResponse {
		if (error instanceof CourseNotFoundError) {
			return McpResourceContentsResponse.notFound(
				uri.href,
				error.message,
			);
		}

		return McpResourceContentsResponse.internalError(
			uri.href,
			error.message,
		);
	}
}
