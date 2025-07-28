import { CourseByIdFinder } from "../../../../../../src/contexts/mooc/courses/application/find-by-id/CourseByIdFinder";
import { CourseNotFoundError } from "../../../../../../src/contexts/mooc/courses/domain/CourseNotFoundError";
import { CourseIdMother } from "../../domain/CourseIdMother";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../infrastructure/MockCourseRepository";

const repository = new MockCourseRepository();
const finder = new CourseByIdFinder(repository);

describe("CourseByIdFinder should", () => {
	it("find a course by id", async () => {
		const course = CourseMother.create();

		repository.shouldSearch(course);

		expect(await finder.find(course.id.value)).toStrictEqual(course);
	});

	it("throw CourseNotFoundError when course is not found", async () => {
		const id = CourseIdMother.create();

		repository.shouldSearchAndReturnNull(id);

		await expect(finder.find(id.value)).rejects.toThrow(
			new CourseNotFoundError(id.value),
		);
	});
});
