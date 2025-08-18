import { Primitives } from "@codelytv/primitives-type";
import { McpTestToolListResponse } from "./McpTestToolListResponse";
export declare class McpTestToolsListResponse {
    readonly tools: McpTestToolListResponse[];
    constructor(tools: McpTestToolListResponse[]);
    static fromPrimitives(primitives: Primitives<McpTestToolsListResponse>): McpTestToolsListResponse;
    names(): string[];
}
