import { Course } from "../../../../../src/contexts/mooc/courses/domain/Course";
import { CourseId } from "../../../../../src/contexts/mooc/courses/domain/CourseId";
import { CourseRepository } from "../../../../../src/contexts/mooc/courses/domain/CourseRepository";

export class MockCourseRepository implements CourseRepository {
	private readonly mockSave = jest.fn();
	private readonly mockSearch = jest.fn();
	private readonly mockSearchByIds = jest.fn();
	private readonly mockSearchSimilar = jest.fn();
	private readonly mockSearchAll = jest.fn();

	async save(course: Course): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(course.toPrimitives());

		return Promise.resolve();
	}

	async search(id: CourseId): Promise<Course | null> {
		expect(this.mockSearch).toHaveBeenCalledWith(id);

		return this.mockSearch() as Promise<Course | null>;
	}

	async searchByIds(ids: CourseId[]): Promise<Course[]> {
		expect(this.mockSearchByIds).toHaveBeenCalledWith(ids);

		return this.mockSearchByIds() as Promise<Course[]>;
	}

	async searchSimilar(ids: CourseId[]): Promise<Course[]> {
		expect(this.mockSearchSimilar).toHaveBeenCalledWith(ids);

		return this.mockSearchSimilar() as Promise<Course[]>;
	}

	async searchAll(): Promise<Course[]> {
		return this.mockSearchAll() as Promise<Course[]>;
	}

	shouldSave(course: Course): void {
		this.mockSave(course.toPrimitives());
	}

	shouldSearch(course: Course): void {
		this.mockSearch(course.id);
		this.mockSearch.mockReturnValueOnce(course);
	}

	shouldSearchAndReturnNull(id: CourseId): void {
		this.mockSearch(id);
		this.mockSearch.mockReturnValueOnce(null);
	}

	shouldSearchByIds(courses: Course[]): void {
		const ids = courses.map((course) => course.id);
		this.mockSearchByIds(ids);
		this.mockSearchByIds.mockReturnValueOnce(courses);
	}

	shouldSearchSimilar(ids: CourseId[], courses: Course[]): void {
		this.mockSearchSimilar(ids);
		this.mockSearchSimilar.mockReturnValueOnce(courses);
	}

	shouldSearchSimilarAndReturnEmpty(ids: CourseId[]): void {
		this.mockSearchSimilar(ids);
		this.mockSearchSimilar.mockReturnValueOnce([]);
	}

	shouldSearchAll(courses: Course[]): void {
		this.mockSearchAll.mockReturnValueOnce(courses);
	}

	shouldSearchAllAndReturnEmpty(): void {
		this.mockSearchAll.mockReturnValueOnce([]);
	}
}
