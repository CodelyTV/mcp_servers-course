"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestToolListResponse = void 0;
class McpTestToolListResponse {
    constructor(name, title, description, inputSchema) {
        this.name = name;
        this.title = title;
        this.description = description;
        this.inputSchema = inputSchema;
    }
    static fromPrimitives(tool) {
        return new McpTestToolListResponse(tool.name, tool.title, tool.description, tool.inputSchema);
    }
}
exports.McpTestToolListResponse = McpTestToolListResponse;
