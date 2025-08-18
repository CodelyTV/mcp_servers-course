import { Primitives } from "@codelytv/primitives-type";
import { McpTestToolContent } from "./McpTestToolContent";
export declare class McpTestToolCallResponse {
    readonly content: McpTestToolContent[];
    readonly structuredContent?: Record<string, unknown> | undefined;
    readonly isError?: boolean | undefined;
    constructor(content: McpTestToolContent[], structuredContent?: Record<string, unknown> | undefined, isError?: boolean | undefined);
    static fromPrimitives(primitives: Primitives<McpTestToolCallResponse>): McpTestToolCallResponse;
    toPrimitives(): Primitives<McpTestToolCallResponse>;
}
