import { Primitives } from "@codelytv/primitives-type";

import { McpTestToolContent } from "./McpTestToolContent";

export class McpTestToolCallResponse {
	constructor(
		public readonly content: McpTestToolContent[],
		public readonly structuredContent?: Record<string, unknown>,
		public readonly isError?: boolean,
	) {}

	static fromPrimitives(
		primitives: Primitives<McpTestToolCallResponse>,
	): McpTestToolCallResponse {
		return new McpTestToolCallResponse(
			primitives.content.map((content) =>
				McpTestToolContent.fromPrimitives(content),
			),
			primitives.structuredContent,
			primitives.isError,
		);
	}

	toPrimitives(): Primitives<McpTestToolCallResponse> {
		const primitives: any = {
			content: this.content.map((content) => content.toPrimitives()),
			isError: this.isError,
		};

		if (this.structuredContent !== undefined) {
			primitives.structuredContent = this.structuredContent;
		}

		return primitives;
	}
}
