import { Primitives } from "@codelytv/primitives-type";
export declare class McpTestPromptMessage {
    readonly role: "user" | "assistant";
    readonly content: {
        type: string;
        text: string;
    };
    constructor(role: "user" | "assistant", content: {
        type: string;
        text: string;
    });
    static fromPrimitives(message: Primitives<McpTestPromptMessage>): McpTestPromptMessage;
    toPrimitives(): Primitives<McpTestPromptMessage>;
}
