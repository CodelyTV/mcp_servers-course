export class McpToolListResponse {
	constructor(
		public readonly name: string,
		public readonly title: string,
		public readonly description: string,
		public readonly inputSchema: object,
	) {}
}