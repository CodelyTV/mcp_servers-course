import { Primitives } from "@codelytv/primitives-type";
export declare class McpTestResourceTemplateListResponse {
    readonly name: string;
    readonly title: string;
    readonly uriTemplate: string;
    readonly description: string;
    constructor(name: string, title: string, uriTemplate: string, description: string);
    static fromPrimitives(resourceTemplate: Primitives<McpTestResourceTemplateListResponse>): McpTestResourceTemplateListResponse;
}
