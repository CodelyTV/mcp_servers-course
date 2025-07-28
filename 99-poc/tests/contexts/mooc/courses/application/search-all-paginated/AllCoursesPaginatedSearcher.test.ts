import { AllCoursesPaginatedSearcher } from "../../../../../../src/contexts/mooc/courses/application/search-all-paginated/AllCoursesPaginatedSearcher";
import { CourseMother } from "../../domain/CourseMother";
import { MockCourseRepository } from "../../infrastructure/MockCourseRepository";

describe("AllCoursesPaginatedSearcher should", () => {
	const repository = new MockCourseRepository();
	const searcher = new AllCoursesPaginatedSearcher(repository);

	it("search all courses", async () => {
		const expectedCourses = [CourseMother.create(), CourseMother.create()];

		repository.shouldSearchAll(expectedCourses);

		expect(await searcher.search()).toEqual(expectedCourses);
	});

	it("return empty array when no courses found", async () => {
		repository.shouldSearchAllAndReturnEmpty();

		expect(await searcher.search()).toEqual([]);
	});
});
