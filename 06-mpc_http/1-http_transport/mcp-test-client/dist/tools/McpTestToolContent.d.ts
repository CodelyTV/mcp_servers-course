import { Primitives } from "@codelytv/primitives-type";
export declare class McpTestToolContent {
    readonly type: "text" | "image" | "resource";
    readonly text?: string | undefined;
    readonly data?: string | undefined;
    readonly mimeType?: string | undefined;
    readonly resource?: {
        uri: string;
        text?: string;
        mimeType?: string;
    } | undefined;
    constructor(type: "text" | "image" | "resource", text?: string | undefined, data?: string | undefined, mimeType?: string | undefined, resource?: {
        uri: string;
        text?: string;
        mimeType?: string;
    } | undefined);
    static fromPrimitives(content: Primitives<McpTestToolContent>): McpTestToolContent;
    toPrimitives(): Primitives<McpTestToolContent>;
}
