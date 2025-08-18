import { Primitives } from "@codelytv/primitives-type";
export declare class McpTestResourcesReadResponseContent {
    readonly uri: string;
    readonly mimeType?: string | undefined;
    readonly text?: string | undefined;
    readonly blob?: string | undefined;
    constructor(uri: string, mimeType?: string | undefined, text?: string | undefined, blob?: string | undefined);
    static fromPrimitives(content: Primitives<McpTestResourcesReadResponseContent>): McpTestResourcesReadResponseContent;
    toPrimitives(): Primitives<McpTestResourcesReadResponseContent>;
}
