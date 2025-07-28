import { Service } from "diod";

import { Course } from "../../domain/Course";
import { CourseRepository } from "../../domain/CourseRepository";

@Service()
export class AllCoursesSearcher {
	constructor(private readonly repository: CourseRepository) {}

	async search(): Promise<Course[]> {
		return await this.repository.searchAll();
	}
}