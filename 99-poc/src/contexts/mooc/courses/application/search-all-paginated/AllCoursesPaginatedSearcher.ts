import { Primitives } from "@codelytv/primitives-type";
import { Service } from "diod";

import { Course } from "../../domain/Course";
import { CourseId } from "../../domain/CourseId";
import { CourseRepository } from "../../domain/CourseRepository";

@Service()
export class AllCoursesPaginatedSearcher {
	constructor(private readonly repository: CourseRepository) {}

	async search(lastCourseId?: string): Promise<Primitives<Course>[]> {
		const lastId = lastCourseId ? new CourseId(lastCourseId) : undefined;

		return (await this.repository.searchAllPaginated(lastId)).map(
			(course) => course.toPrimitives(),
		);
	}
}
