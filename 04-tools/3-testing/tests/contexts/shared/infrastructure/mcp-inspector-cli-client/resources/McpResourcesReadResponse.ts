import { Primitives } from "@codelytv/primitives-type";

import { McpResourcesReadResponseContent } from "./McpResourcesReadResponseContent";

export class McpResourcesReadResponse {
	constructor(public readonly contents: McpResourcesReadResponseContent[]) {}

	static fromPrimitives(
		primitives: Primitives<McpResourcesReadResponse>,
	): McpResourcesReadResponse {
		return new McpResourcesReadResponse(
			primitives.contents.map((content) =>
				McpResourcesReadResponseContent.fromPrimitives(content),
			),
		);
	}

	toPrimitives(): Primitives<McpResourcesReadResponse> {
		return {
			contents: this.contents.map((content) => content.toPrimitives()),
		};
	}
}
