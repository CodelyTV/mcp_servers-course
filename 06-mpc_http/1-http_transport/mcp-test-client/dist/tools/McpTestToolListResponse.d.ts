import { Primitives } from "@codelytv/primitives-type";
export declare class McpTestToolListResponse {
    readonly name: string;
    readonly title: string;
    readonly description: string;
    readonly inputSchema: object;
    constructor(name: string, title: string, description: string, inputSchema: object);
    static fromPrimitives(tool: Primitives<McpTestToolListResponse>): McpTestToolListResponse;
}
