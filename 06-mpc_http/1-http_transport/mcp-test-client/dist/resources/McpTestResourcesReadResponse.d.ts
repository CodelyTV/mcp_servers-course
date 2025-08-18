import { Primitives } from "@codelytv/primitives-type";
import { McpTestResourcesReadResponseContent } from "./McpTestResourcesReadResponseContent";
type McpError = {
    code: number;
    message: string;
    data?: unknown;
};
export declare class McpTestResourcesReadResponse {
    readonly contents?: McpTestResourcesReadResponseContent[] | undefined;
    readonly error?: McpError | undefined;
    constructor(contents?: McpTestResourcesReadResponseContent[] | undefined, error?: McpError | undefined);
    static fromPrimitives(primitives: Primitives<McpTestResourcesReadResponse>): McpTestResourcesReadResponse;
    static fromError(error: McpError): McpTestResourcesReadResponse;
    toPrimitives(): Primitives<McpTestResourcesReadResponse>;
}
export {};
