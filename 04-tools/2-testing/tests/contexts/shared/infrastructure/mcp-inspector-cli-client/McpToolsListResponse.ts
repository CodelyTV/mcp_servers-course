import { McpToolListResponse } from "./McpToolListResponse";

export class McpToolsListResponse {
	constructor(public readonly tools: McpToolListResponse[]) {}
}