import "reflect-metadata";

import { NextRequest, NextResponse } from "next/server";

import { AllCoursesPaginatedSearcher } from "../../../../../contexts/mooc/courses/application/search-all-paginated/AllCoursesPaginatedSearcher";
import { container } from "../../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { withErrorHandling } from "../../../../../contexts/shared/infrastructure/http/withErrorHandling";

const searcher = container.get(AllCoursesPaginatedSearcher);

export const GET = withErrorHandling(
	async (request: NextRequest): Promise<NextResponse> => {
		const cursor = request.nextUrl.searchParams.get("cursor");

		const courses = await searcher.search(cursor);

		return NextResponse.json({
			courses,
		});
	},
);
