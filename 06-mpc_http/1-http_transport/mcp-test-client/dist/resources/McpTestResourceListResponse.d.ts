import { Primitives } from "@codelytv/primitives-type";
export declare class McpTestResourceListResponse {
    readonly uri: string;
    readonly name: string;
    readonly title: string;
    readonly description: string;
    constructor(uri: string, name: string, title: string, description: string);
    static fromPrimitives(resource: Primitives<McpTestResourceListResponse>): McpTestResourceListResponse;
}
