import { AllCoursesPaginatedSearcher } from "../../../../../../src/contexts/mooc/courses/application/search-all-paginated/AllCoursesPaginatedSearcher";
import { CourseIdMother } from "../../domain/CourseIdMother";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../infrastructure/MockCourseRepository";

describe("AllCoursesPaginatedSearcher should", () => {
	const repository = new MockCourseRepository();
	const searcher = new AllCoursesPaginatedSearcher(repository);

	it("search all courses without pagination", async () => {
		const expectedCourses = [CourseMother.create(), CourseMother.create()];

		repository.shouldSearchAllPaginated(expectedCourses);

		expect(await searcher.search()).toEqual(
			expectedCourses.map((course) => course.toPrimitives()),
		);
	});

	it("search courses with pagination", async () => {
		const lastCourseId = CourseIdMother.create();
		const expectedCourses = [CourseMother.create(), CourseMother.create()];

		repository.shouldSearchAllPaginated(expectedCourses);

		expect(await searcher.search(lastCourseId.value)).toEqual(
			expectedCourses.map((course) => course.toPrimitives()),
		);
	});

	it("return empty array when no courses found", async () => {
		repository.shouldSearchAllPaginatedAndReturnEmpty();

		expect(await searcher.search()).toEqual([]);
	});

	it("return empty array when no more courses found with pagination", async () => {
		const lastCourseId = CourseIdMother.create();

		repository.shouldSearchAllPaginatedAndReturnEmpty();

		expect(await searcher.search(lastCourseId.value)).toEqual([]);
	});
});
