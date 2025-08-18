"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestResourceListResponse = void 0;
class McpTestResourceListResponse {
    constructor(uri, name, title, description) {
        this.uri = uri;
        this.name = name;
        this.title = title;
        this.description = description;
    }
    static fromPrimitives(resource) {
        return new McpTestResourceListResponse(resource.uri, resource.name, resource.title, resource.description);
    }
}
exports.McpTestResourceListResponse = McpTestResourceListResponse;
