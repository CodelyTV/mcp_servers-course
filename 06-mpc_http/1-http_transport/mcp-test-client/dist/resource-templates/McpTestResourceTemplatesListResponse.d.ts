import { Primitives } from "@codelytv/primitives-type";
import { McpTestResourceTemplateListResponse } from "./McpTestResourceTemplateListResponse";
export declare class McpTestResourceTemplatesListResponse {
    readonly resourceTemplates: McpTestResourceTemplateListResponse[];
    constructor(resourceTemplates: McpTestResourceTemplateListResponse[]);
    static fromPrimitives(primitives: Primitives<McpTestResourceTemplatesListResponse>): McpTestResourceTemplatesListResponse;
    uris(): string[];
}
