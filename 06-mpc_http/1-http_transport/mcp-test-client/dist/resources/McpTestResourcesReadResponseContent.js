"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestResourcesReadResponseContent = void 0;
class McpTestResourcesReadResponseContent {
    constructor(uri, mimeType, text, blob) {
        this.uri = uri;
        this.mimeType = mimeType;
        this.text = text;
        this.blob = blob;
    }
    static fromPrimitives(content) {
        return new McpTestResourcesReadResponseContent(content.uri, content.mimeType, content.text, content.blob);
    }
    toPrimitives() {
        return {
            uri: this.uri,
            mimeType: this.mimeType,
            text: this.text,
            blob: this.blob,
        };
    }
}
exports.McpTestResourcesReadResponseContent = McpTestResourcesReadResponseContent;
