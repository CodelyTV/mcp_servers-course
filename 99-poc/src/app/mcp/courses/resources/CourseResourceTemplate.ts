/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { CourseByIdFinder } from "../../../../contexts/mooc/courses/application/find-by-id/CourseByIdFinder";
import { CourseNotFoundError } from "../../../../contexts/mooc/courses/domain/CourseNotFoundError";
import { container } from "../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { McpResourceTemplate } from "../../../../contexts/shared/infrastructure/mcp/McpResourceTemplate";

export class CourseResourceTemplate implements McpResourceTemplate {
	name = "course-detail";
	title = "Course Detail";
	description = "Get detailed information about a specific course by ID";
	uriTemplate = "courses://{id}";

	async handler(uri: URL, params: Record<string, string | string[]>) {
		const courseId = Array.isArray(params.id) ? params.id[0] : params.id;

		return this.getCourseData(courseId, uri);
	}

	private async getCourseData(courseId: string, uri: URL) {
		if (!courseId) {
			return {
				contents: [
					{
						uri: uri.href,
						mimeType: "application/json",
						text: JSON.stringify(
							{ error: "Course ID is required" },
							null,
							2,
						),
					},
				],
			};
		}

		try {
			const courseByIdFinder = container.get(CourseByIdFinder);
			const course = await courseByIdFinder.find(courseId);

			return {
				contents: [
					{
						uri: uri.href,
						mimeType: "application/json",
						text: JSON.stringify(course, null, 2),
					},
				],
			};
		} catch (error) {
			if (error instanceof CourseNotFoundError) {
				return {
					contents: [
						{
							uri: uri.href,
							mimeType: "application/json",
							text: JSON.stringify(
								{
									error: `Course with ID ${courseId} not found`,
								},
								null,
								2,
							),
						},
					],
				};
			}

			return {
				contents: [
					{
						uri: uri.href,
						mimeType: "application/json",
						text: JSON.stringify(
							{ error: "Internal server error" },
							null,
							2,
						),
					},
				],
			};
		}
	}
}
