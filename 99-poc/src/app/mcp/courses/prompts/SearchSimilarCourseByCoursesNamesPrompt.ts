import { Primitives } from "@codelytv/primitives-type";
import { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";
import { Service } from "diod";
import * as z from "zod/v3";

import { CourseBySimilarNameFinder } from "../../../../contexts/mooc/courses/application/find-by-similar-name/CourseBySimilarNameFinder";
import { Course } from "../../../../contexts/mooc/courses/domain/Course";
import { McpPrompt } from "../../../../contexts/shared/infrastructure/mcp/McpPrompt";

@Service()
export class SearchSimilarCourseByCoursesNamesPrompt implements McpPrompt {
	name = "courses-search_similar_by_names";
	title = "Buscar Cursos con Nombres Similares";
	description =
		"Genera un prompt para buscar un curso similar a los cursos enviados";

	argsSchema = { names: z.string().optional() };

	constructor(private readonly finder: CourseBySimilarNameFinder) {}

	async handler(args?: { names?: string }): Promise<GetPromptResult> {
		const names =
			args?.names
				?.split(",")
				.map((name) => name.trim())
				.filter((name) => name.length > 0) ?? [];

		if (names.length === 0) {
			return {
				description:
					"Por favor proporciona nombres de cursos para buscar cursos similares",
				messages: [
					{
						role: "user",
						content: {
							type: "text",
							text: "Necesitas proporcionar nombres de cursos para encontrar cursos similares. Usa el formato: names=curso1,curso2,curso3",
						},
					},
				],
			};
		}

		const foundCourses: Primitives<Course>[] = [];
		const notFoundNames: string[] = [];

		const searchPromises = names.map(async (name) => {
			try {
				const course = await this.finder.find(name);

				return { success: true as const, course, name };
			} catch {
				return { success: false as const, name };
			}
		});

		const results = await Promise.all(searchPromises);

		for (const result of results) {
			if (result.success) {
				foundCourses.push(result.course);
			} else {
				notFoundNames.push(result.name);
			}
		}

		if (foundCourses.length === 0) {
			return {
				description: "Error buscando cursos similares",
				messages: [
					{
						role: "user",
						content: {
							type: "text",
							text: `No se encontraron cursos similares a los nombres proporcionados: ${names.join(", ")}`,
						},
					},
				],
			};
		}

		const courseList = foundCourses
			.map((course) => `- ${course.name} (ID: ${course.id})`)
			.join("\n");

		const notFoundText =
			notFoundNames.length > 0
				? `\n\nNo se encontraron cursos similares para: ${notFoundNames.join(
						", ",
					)}`
				: "";

		return {
			description: `Buscar cursos similares a ${foundCourses.length} curso(s) encontrado(s)`,
			messages: [
				{
					role: "user",
					content: {
						type: "text",
						text: `Encontré ${foundCourses.length} curso(s) similar(es):\n\n${courseList}${notFoundText}\n\nPor favor ayúdame a encontrar más cursos que sean similares a estos en tema, dificultad o contenido.`,
					},
				},
			],
		};
	}
}
