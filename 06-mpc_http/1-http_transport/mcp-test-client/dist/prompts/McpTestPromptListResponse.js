"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestPromptListResponse = void 0;
class McpTestPromptListResponse {
    constructor(name, title, description, args) {
        this.name = name;
        this.title = title;
        this.description = description;
        this.args = args;
    }
    static fromPrimitives(prompt) {
        return new McpTestPromptListResponse(prompt.name, prompt.title, prompt.description, prompt.args);
    }
}
exports.McpTestPromptListResponse = McpTestPromptListResponse;
