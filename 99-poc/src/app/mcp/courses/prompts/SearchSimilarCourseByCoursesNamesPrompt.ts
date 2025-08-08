import { Primitives } from "@codelytv/primitives-type";
import { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";
import { Service } from "diod";
import * as z from "zod/v3";

import { CourseBySimilarNameFinder } from "../../../../contexts/mooc/courses/application/find-by-similar-name/CourseBySimilarNameFinder";
import { Course } from "../../../../contexts/mooc/courses/domain/Course";
import { McpPrompt } from "../../../../contexts/shared/infrastructure/mcp/McpPrompt";
import { McpPromptResponse } from "../../../../contexts/shared/infrastructure/mcp/McpPromptResponse";

@Service()
export class SearchSimilarCourseByCoursesNamesPrompt implements McpPrompt {
	name = "courses-search_similar_by_names";
	title = "Buscar Cursos con Nombres Similares";
	description =
		"Genera un prompt para buscar un curso similar a los cursos enviados";

	argsSchema = { names: z.string().optional() };

	constructor(private readonly finder: CourseBySimilarNameFinder) {}

	async handler(args?: { names?: string }): Promise<GetPromptResult> {
		const names = (args?.names ?? "")
			.split(",")
			.map((name) => name.trim())
			.filter((name) => name.length > 0);

		if (names.length === 0) {
			return McpPromptResponse.userText(
				"Necesitas proporcionar nombres de cursos para encontrar cursos similares. Usa el formato: names=curso1,curso2,curso3",
				"Por favor proporciona nombres de cursos para buscar cursos similares",
			).toGetPromptResult();
		}

		const settledResults = await Promise.allSettled(
			names.map((name) => this.finder.find(name)),
		);

		const foundCourses = settledResults
			.filter(
				(
					result,
				): result is PromiseFulfilledResult<Primitives<Course>> =>
					result.status === "fulfilled",
			)
			.map((result) => result.value);

		if (foundCourses.length === 0) {
			return McpPromptResponse.userText(
				`No se encontraron cursos similares a los nombres proporcionados: ${names.join(", ")}`,
				"Error buscando cursos similares",
			).toGetPromptResult();
		}

		return McpPromptResponse.userText(
			`Buscar cursos similares usando la herramienta courses-search_similar_by_ids a estos ids: ${foundCourses
				.map((course) => course.id)
				.join(", ")}`.trim(),
			`Buscar cursos similares a ${foundCourses.length} curso(s) encontrado(s)`,
		).toGetPromptResult();
	}
}
