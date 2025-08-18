"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestPromptsListResponse = void 0;
const McpTestPromptListResponse_1 = require("./McpTestPromptListResponse");
class McpTestPromptsListResponse {
    constructor(prompts) {
        this.prompts = prompts;
    }
    static fromPrimitives(primitives) {
        return new McpTestPromptsListResponse(primitives.prompts.map((prompt) => McpTestPromptListResponse_1.McpTestPromptListResponse.fromPrimitives(prompt)));
    }
    names() {
        return this.prompts.map((prompt) => prompt.name);
    }
}
exports.McpTestPromptsListResponse = McpTestPromptsListResponse;
