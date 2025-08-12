import { Primitives } from "@codelytv/primitives-type";

export class McpResourceContent {
	constructor(
		public readonly uri: string,
		public readonly mimeType?: string,
		public readonly text?: string,
		public readonly blob?: string,
	) {}

	static fromPrimitives(
		content: Primitives<McpResourceContent>,
	): McpResourceContent {
		return new McpResourceContent(
			content.uri,
			content.mimeType,
			content.text,
			content.blob,
		);
	}

	toPrimitives(): Primitives<McpResourceContent> {
		return {
			uri: this.uri,
			mimeType: this.mimeType,
			text: this.text,
			blob: this.blob,
		};
	}
}
