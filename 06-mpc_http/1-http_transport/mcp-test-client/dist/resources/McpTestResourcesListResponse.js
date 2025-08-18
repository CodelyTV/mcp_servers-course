"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestResourcesListResponse = void 0;
const McpTestResourceListResponse_1 = require("./McpTestResourceListResponse");
class McpTestResourcesListResponse {
    constructor(resources) {
        this.resources = resources;
    }
    static fromPrimitives(primitives) {
        return new McpTestResourcesListResponse(primitives.resources.map((resource) => McpTestResourceListResponse_1.McpTestResourceListResponse.fromPrimitives(resource)));
    }
    uris() {
        return this.resources.map((resource) => resource.uri);
    }
}
exports.McpTestResourcesListResponse = McpTestResourcesListResponse;
