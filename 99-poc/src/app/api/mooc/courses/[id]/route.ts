import "reflect-metadata";

import { NextRequest, NextResponse } from "next/server";

import { CourseByIdFinder } from "../../../../../contexts/mooc/courses/application/find-by-id/CourseByIdFinder";
import { container } from "../../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { withErrorHandling } from "../../../../../contexts/shared/infrastructure/http/withErrorHandling";

const finder = container.get(CourseByIdFinder);

export const GET = withErrorHandling(
	async (
		_request: NextRequest,
		{ params }: { params: { id: string } },
	): Promise<NextResponse> => {
		const course = await finder.find(params.id);

		return NextResponse.json(course.toPrimitives());
	},
);
