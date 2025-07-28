import { Service } from "diod";

import { Course } from "../../domain/Course";
import { CourseId } from "../../domain/CourseId";
import { CourseNotFoundError } from "../../domain/CourseNotFoundError";
import { CourseRepository } from "../../domain/CourseRepository";

export type CourseByIdFinderErrors = CourseNotFoundError;

@Service()
export class CourseByIdFinder {
	constructor(private readonly repository: CourseRepository) {}

	async find(id: string): Promise<Course> {
		const course = await this.repository.search(new CourseId(id));

		if (!course) {
			throw new CourseNotFoundError(id);
		}

		return course;
	}
}
