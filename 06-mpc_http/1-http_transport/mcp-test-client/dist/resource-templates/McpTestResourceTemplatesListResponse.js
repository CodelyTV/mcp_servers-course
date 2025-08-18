"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestResourceTemplatesListResponse = void 0;
const McpTestResourceTemplateListResponse_1 = require("./McpTestResourceTemplateListResponse");
class McpTestResourceTemplatesListResponse {
    constructor(resourceTemplates) {
        this.resourceTemplates = resourceTemplates;
    }
    static fromPrimitives(primitives) {
        return new McpTestResourceTemplatesListResponse(primitives.resourceTemplates.map((resourceTemplate) => McpTestResourceTemplateListResponse_1.McpTestResourceTemplateListResponse.fromPrimitives(resourceTemplate)));
    }
    uris() {
        return this.resourceTemplates.map((resource) => resource.uriTemplate);
    }
}
exports.McpTestResourceTemplatesListResponse = McpTestResourceTemplatesListResponse;
