import { Primitives } from "@codelytv/primitives-type";
import { McpTestPromptListResponse } from "./McpTestPromptListResponse";
export declare class McpTestPromptsListResponse {
    readonly prompts: McpTestPromptListResponse[];
    constructor(prompts: McpTestPromptListResponse[]);
    static fromPrimitives(primitives: Primitives<McpTestPromptsListResponse>): McpTestPromptsListResponse;
    names(): string[];
}
