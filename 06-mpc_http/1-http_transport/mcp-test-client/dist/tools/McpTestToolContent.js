"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestToolContent = void 0;
class McpTestToolContent {
    constructor(type, text, data, mimeType, resource) {
        this.type = type;
        this.text = text;
        this.data = data;
        this.mimeType = mimeType;
        this.resource = resource;
    }
    static fromPrimitives(content) {
        return new McpTestToolContent(content.type, content.text, content.data, content.mimeType, content.resource);
    }
    toPrimitives() {
        return {
            type: this.type,
            text: this.text,
            data: this.data,
            mimeType: this.mimeType,
            resource: this.resource,
        };
    }
}
exports.McpTestToolContent = McpTestToolContent;
