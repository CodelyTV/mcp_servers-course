import { Primitives } from "@codelytv/primitives-type";

export class McpTestToolContent {
	constructor(
		public readonly type: "text" | "image" | "resource",
		public readonly text?: string,
		public readonly data?: string,
		public readonly mimeType?: string,
		public readonly resource?: {
			uri: string;
			text?: string;
			mimeType?: string;
		},
	) {}

	static fromPrimitives(
		content: Primitives<McpTestToolContent>,
	): McpTestToolContent {
		return new McpTestToolContent(
			content.type,
			content.text,
			content.data,
			content.mimeType,
			content.resource,
		);
	}

	toPrimitives(): Primitives<McpTestToolContent> {
		const primitives: any = {
			type: this.type,
		};

		if (this.text !== undefined) {
			primitives.text = this.text;
		}
		if (this.data !== undefined) {
			primitives.data = this.data;
		}
		if (this.mimeType !== undefined) {
			primitives.mimeType = this.mimeType;
		}
		if (this.resource !== undefined) {
			primitives.resource = this.resource;
		}

		return primitives;
	}
}
