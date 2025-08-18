import { Primitives } from "@codelytv/primitives-type";
export declare class McpTestPromptListResponse {
    readonly name: string;
    readonly title: string;
    readonly description: string;
    readonly args: object;
    constructor(name: string, title: string, description: string, args: object);
    static fromPrimitives(prompt: Primitives<McpTestPromptListResponse>): McpTestPromptListResponse;
}
