import { Resource } from "@modelcontextprotocol/sdk/types.js";

import { AllCoursesSearcher } from "../../contexts/mooc/courses/application/search-all/AllCoursesSearcher";
import { container } from "../../contexts/shared/infrastructure/dependency-injection/diod.config";

export async function getCoursesResource(): Promise<Resource[]> {
	const coursesSearcher = container.get(AllCoursesSearcher);
	const courses = await coursesSearcher.search();

	return [
		{
			uri: "courses://all",
			name: "All Courses",
			description: "Complete list of all available courses",
			mimeType: "application/json",
			text: JSON.stringify(courses, null, 2),
		},
	];
}
