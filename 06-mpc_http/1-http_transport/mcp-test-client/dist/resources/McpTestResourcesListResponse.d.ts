import { Primitives } from "@codelytv/primitives-type";
import { McpTestResourceListResponse } from "./McpTestResourceListResponse";
export declare class McpTestResourcesListResponse {
    readonly resources: McpTestResourceListResponse[];
    constructor(resources: McpTestResourceListResponse[]);
    static fromPrimitives(primitives: Primitives<McpTestResourcesListResponse>): McpTestResourcesListResponse;
    uris(): string[];
}
