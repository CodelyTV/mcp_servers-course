import { Primitives } from "@codelytv/primitives-type";
import { Service } from "diod";

import { InvalidNanoIdError } from "../../../../shared/domain/InvalidNanoIdError";
import { Course } from "../../domain/Course";
import { CourseId } from "../../domain/CourseId";
import { CourseRepository } from "../../domain/CourseRepository";
import { InvalidCourseCursorError } from "../../domain/InvalidCourseCursorError";

export type AllCoursesPaginatedSearcherErrors =
	| InvalidCourseCursorError
	| InvalidNanoIdError;

@Service()
export class AllCoursesPaginatedSearcher {
	constructor(private readonly repository: CourseRepository) {}

	async search(cursor: string | null): Promise<Primitives<Course>[]> {
		const lastCourseId = cursor ? this.decodeCursor(cursor) : null;

		return (await this.repository.searchAllPaginated(lastCourseId)).map(
			(course) => course.toPrimitives(),
		);
	}

	private decodeCursor(cursor: string): CourseId {
		let lastCourseId: string;

		try {
			lastCourseId = Buffer.from(cursor, "base64").toString("utf-8");
		} catch {
			throw new InvalidCourseCursorError(cursor);
		}

		return new CourseId(lastCourseId);
	}
}
