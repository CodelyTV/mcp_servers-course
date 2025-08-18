"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestPromptGetResponse = void 0;
const McpTestPromptMessage_1 = require("./McpTestPromptMessage");
class McpTestPromptGetResponse {
    constructor(messages) {
        this.messages = messages;
    }
    static fromPrimitives(primitives) {
        return new McpTestPromptGetResponse(primitives.messages.map((message) => McpTestPromptMessage_1.McpTestPromptMessage.fromPrimitives(message)));
    }
    toPrimitives() {
        return {
            messages: this.messages.map((message) => message.toPrimitives()),
        };
    }
    firstPromptText() {
        return this.messages[0].content.text;
    }
}
exports.McpTestPromptGetResponse = McpTestPromptGetResponse;
