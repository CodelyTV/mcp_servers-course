/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { CourseByIdFinder } from "../../../../contexts/mooc/courses/application/find-by-id/CourseByIdFinder";
import { CourseNotFoundError } from "../../../../contexts/mooc/courses/domain/CourseNotFoundError";
import { container } from "../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { McpResource } from "../../../../contexts/shared/infrastructure/mcp/McpResource";

export class CourseDetailResource implements McpResource {
	name = "course-detail";
	title = "Course Detail";
	description = "Get detailed information about a specific course by ID";
	uriTemplate = "course://detail/{id}";

	async handler(uri: URL) {
		const pathParts = uri.pathname.split("/");
		const courseId = pathParts[pathParts.length - 1];

		return this.getCourseData(courseId, uri);
	}

	async handlerWithVariables(uri: URL, variables: any) {
		return this.getCourseData(variables.id, uri);
	}

	private async getCourseData(courseId: string, uri: URL) {
		if (!courseId) {
			return {
				contents: [
					{
						uri: uri.href,
						mimeType: "application/json",
						text: JSON.stringify({ error: "Course ID is required" }, null, 2),
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
							text: JSON.stringify({ error: `Course with ID ${courseId} not found` }, null, 2),
						},
					],
				};
			}

			return {
				contents: [
					{
						uri: uri.href,
						mimeType: "application/json",
						text: JSON.stringify({ error: "Internal server error" }, null, 2),
					},
				],
			};
		}
	}
}