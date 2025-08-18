"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestPromptMessage = void 0;
class McpTestPromptMessage {
    constructor(role, content) {
        this.role = role;
        this.content = content;
    }
    static fromPrimitives(message) {
        return new McpTestPromptMessage(message.role, message.content);
    }
    toPrimitives() {
        return {
            role: this.role,
            content: this.content,
        };
    }
}
exports.McpTestPromptMessage = McpTestPromptMessage;
