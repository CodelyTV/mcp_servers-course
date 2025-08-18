import { Primitives } from "@codelytv/primitives-type";
import { McpTestPromptMessage } from "./McpTestPromptMessage";
export declare class McpTestPromptGetResponse {
    readonly messages: McpTestPromptMessage[];
    constructor(messages: McpTestPromptMessage[]);
    static fromPrimitives(primitives: Primitives<McpTestPromptGetResponse>): McpTestPromptGetResponse;
    toPrimitives(): Primitives<McpTestPromptGetResponse>;
    firstPromptText(): string;
}
