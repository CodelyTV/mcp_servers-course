import { Service } from "diod";
import { z } from "zod";

import {
	CourseByIdFinder,
	CourseByIdFinderErrors,
} from "../../../../contexts/mooc/courses/application/find-by-id/CourseByIdFinder";
import { CourseNotFoundError } from "../../../../contexts/mooc/courses/domain/CourseNotFoundError";
import { assertNever } from "../../../../contexts/shared/domain/assertNever";
import { InvalidNanoIdError } from "../../../../contexts/shared/domain/InvalidNanoIdError";
import { McpTool } from "../../../../contexts/shared/infrastructure/mcp/McpTool";
import { McpToolResponse } from "../../../../contexts/shared/infrastructure/mcp/McpToolResponse";

@Service()
export class SearchCourseByIdTool implements McpTool {
	name = "courses-search_by_id";
	title = "Find Course by ID";
	description =
		"Returns detailed information about a specific course by its ID";

	inputSchema = {
		id: z.string().describe("The unique identifier of the course"),
	};

	constructor(private readonly finder: CourseByIdFinder) {}

	async handler(args?: Record<string, unknown>): Promise<McpToolResponse> {
		if (
			!args ||
			!args.id ||
			typeof args.id !== "string" ||
			args.id.trim() === ""
		) {
			return McpToolResponse.error("Course ID is required");
		}

		try {
			const course = await this.finder.find(args.id);

			return McpToolResponse.structured({
				course: course.toPrimitives(),
			});
		} catch (error) {
			return this.handleError(error as CourseByIdFinderErrors);
		}
	}

	private handleError(error: CourseByIdFinderErrors): McpToolResponse {
		switch (true) {
			case error instanceof CourseNotFoundError:
				return McpToolResponse.error(
					`Course not found: ${error.message}`,
				);
			case error instanceof InvalidNanoIdError:
				return McpToolResponse.error("Invalid course ID format");
			default:
				assertNever(error);
		}
	}
}
