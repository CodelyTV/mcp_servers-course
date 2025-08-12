import { Service } from "diod";

import {
	CourseByIdFinderErrors,
	CourseFinder,
} from "../../../../contexts/mooc/courses/application/find/CourseFinder";
import { CourseNotFoundError } from "../../../../contexts/mooc/courses/domain/CourseNotFoundError";
import { assertNever } from "../../../../contexts/shared/domain/assertNever";
import { InvalidNanoIdError } from "../../../../contexts/shared/domain/InvalidNanoIdError";
import { McpResourceResponse } from "../../../../contexts/shared/infrastructure/mcp/McpResourceResponse";
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
	): Promise<McpResourceResponse> {
		const course = await this.finder.find(params.id);

		return McpResourceResponse.success(uri, course);
	}

	onError(
		error: CourseByIdFinderErrors,
		uri: string,
		_params: { id: string },
	): McpResourceResponse {
		switch (true) {
			case error instanceof CourseNotFoundError:
				return McpResourceResponse.notFound(
					uri,
					`The course <${error.id}> has not been found`,
				);
			case error instanceof InvalidNanoIdError:
				return McpResourceResponse.badRequest(
					uri,
					`The id <${error.id}> is not a valid nano id`,
				);
			default:
				assertNever(error);
		}
	}
}
