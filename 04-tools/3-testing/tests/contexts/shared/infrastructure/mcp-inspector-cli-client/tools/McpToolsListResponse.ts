import { Primitives } from "@codelytv/primitives-type";

import { McpTestToolListResponse } from "./McpTestToolListResponse";

export class McpToolsListResponse {
	constructor(public readonly tools: McpTestToolListResponse[]) {}

	static fromPrimitives(
		primitives: Primitives<McpToolsListResponse>,
	): McpToolsListResponse {
		return new McpToolsListResponse(
			primitives.tools.map((tool) =>
				McpTestToolListResponse.fromPrimitives(tool),
			),
		);
	}

	names(): string[] {
		return this.tools.map((tool) => tool.name);
	}
}
