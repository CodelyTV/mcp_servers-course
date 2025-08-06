import "reflect-metadata";

import { NextRequest, NextResponse } from "next/server";

import { CourseByIdFinder } from "../../../../../contexts/mooc/courses/application/find/CourseByIdFinder";
import { container } from "../../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "../../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { withErrorHandling } from "../../../../../contexts/shared/infrastructure/http/withErrorHandling";

const finder = container.get(CourseByIdFinder);

export const GET = withErrorHandling(
	async (
		_request: NextRequest,
		{ params }: { params: Promise<{ id: string }> },
	): Promise<NextResponse> => {
		const resolvedParams = await params;
		const course = await finder.find(resolvedParams.id);

		return HttpNextResponse.json(course.toPrimitives());
	},
);
