"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestResourcesReadResponse = void 0;
const McpTestResourcesReadResponseContent_1 = require("./McpTestResourcesReadResponseContent");
class McpTestResourcesReadResponse {
    constructor(contents, error) {
        this.contents = contents;
        this.error = error;
    }
    static fromPrimitives(primitives) {
        if (primitives.error) {
            return new McpTestResourcesReadResponse(undefined, primitives.error);
        }
        return new McpTestResourcesReadResponse(primitives.contents?.map((content) => McpTestResourcesReadResponseContent_1.McpTestResourcesReadResponseContent.fromPrimitives(content)));
    }
    static fromError(error) {
        return new McpTestResourcesReadResponse(undefined, error);
    }
    toPrimitives() {
        if (this.error) {
            return { error: this.error };
        }
        return {
            contents: this.contents?.map((content) => content.toPrimitives()) ?? [],
        };
    }
}
exports.McpTestResourcesReadResponse = McpTestResourcesReadResponse;
