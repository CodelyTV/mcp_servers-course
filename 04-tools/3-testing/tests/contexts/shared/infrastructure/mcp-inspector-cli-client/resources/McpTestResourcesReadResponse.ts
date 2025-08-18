import { Primitives } from "@codelytv/primitives-type";

import { McpTestResourcesReadResponseContent } from "./McpTestResourcesReadResponseContent";

export class McpTestResourcesReadResponse {
	constructor(
		public readonly contents: McpTestResourcesReadResponseContent[],
	) {}

	static fromPrimitives(
		primitives: Primitives<McpTestResourcesReadResponse>,
	): McpTestResourcesReadResponse {
		return new McpTestResourcesReadResponse(
			primitives.contents.map((content) =>
				McpTestResourcesReadResponseContent.fromPrimitives(content),
			),
		);
	}

	toPrimitives(): Primitives<McpTestResourcesReadResponse> {
		return {
			contents: this.contents.map((content) => content.toPrimitives()),
		};
	}
}
