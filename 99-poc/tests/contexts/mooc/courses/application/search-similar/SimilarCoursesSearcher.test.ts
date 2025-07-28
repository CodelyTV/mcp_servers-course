import { SimilarCoursesSearcher } from "../../../../../../src/contexts/mooc/courses/application/search-similar/SimilarCoursesSearcher";
import { CourseIdMother } from "../../domain/CourseIdMother";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../infrastructure/MockCourseRepository";

describe("SimilarCoursesSearcher should", () => {
	const repository = new MockCourseRepository();
	const searcher = new SimilarCoursesSearcher(repository);

	it("search similar courses by ids", async () => {
		const courseId1 = CourseIdMother.create();
		const courseId2 = CourseIdMother.create();
		const expectedCourses = [CourseMother.create(), CourseMother.create()];
		const courseIds = [courseId1, courseId2];

		repository.shouldSearchSimilar(courseIds, expectedCourses);

		expect(await searcher.search(courseIds.map((id) => id.value))).toEqual(
			expectedCourses.map((course) => course.toPrimitives()),
		);
	});

	it("return empty array when no similar courses found", async () => {
		const courseId = CourseIdMother.create();

		repository.shouldSearchSimilarAndReturnEmpty([courseId]);

		const result = await searcher.search([courseId.value]);

		expect(result).toEqual([]);
	});
});
