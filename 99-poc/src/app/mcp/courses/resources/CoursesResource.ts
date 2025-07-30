/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

import { AllCoursesSearcher } from "../../../../contexts/mooc/courses/application/search-all/AllCoursesSearcher";
import { container } from "../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { McpResource } from "../../../../contexts/shared/infrastructure/mcp/McpResource";

export class CoursesResource implements McpResource {
	name = "courses";

	template = new ResourceTemplate("courses://all");

	description = {
		title: "All Courses",
		description: "Complete list of all available courses",
	};

	async handler(uri: URL) {
		const coursesSearcher = container.get(AllCoursesSearcher);
		const courses = await coursesSearcher.search();

		return {
			contents: [
				{
					uri: uri.href,
					mimeType: "application/json",
					text: JSON.stringify(courses, null, 2),
				},
			],
		};
	}
}
