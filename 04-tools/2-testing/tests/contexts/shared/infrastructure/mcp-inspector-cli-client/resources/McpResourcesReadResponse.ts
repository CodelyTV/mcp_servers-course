import { Primitives } from "@codelytv/primitives-type";

import { McpResourceContent } from "./McpResourceContent";

export class McpResourcesReadResponse {
	constructor(public readonly contents: McpResourceContent[]) {}

	static fromPrimitives(
		primitives: Primitives<McpResourcesReadResponse>,
	): McpResourcesReadResponse {
		return new McpResourcesReadResponse(
			primitives.contents.map((content) =>
				McpResourceContent.fromPrimitives(content),
			),
		);
	}

	toPrimitives(): Primitives<McpResourcesReadResponse> {
		return {
			contents: this.contents.map((content) => content.toPrimitives()),
		};
	}
}
