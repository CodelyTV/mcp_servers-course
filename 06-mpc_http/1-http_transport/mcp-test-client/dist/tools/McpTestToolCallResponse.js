"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestToolCallResponse = void 0;
const McpTestToolContent_1 = require("./McpTestToolContent");
class McpTestToolCallResponse {
    constructor(content, structuredContent, isError) {
        this.content = content;
        this.structuredContent = structuredContent;
        this.isError = isError;
    }
    static fromPrimitives(primitives) {
        return new McpTestToolCallResponse(primitives.content.map((content) => McpTestToolContent_1.McpTestToolContent.fromPrimitives(content)), primitives.structuredContent, primitives.isError);
    }
    toPrimitives() {
        return {
            content: this.content.map((content) => content.toPrimitives()),
            structuredContent: this.structuredContent,
            isError: this.isError,
        };
    }
}
exports.McpTestToolCallResponse = McpTestToolCallResponse;
