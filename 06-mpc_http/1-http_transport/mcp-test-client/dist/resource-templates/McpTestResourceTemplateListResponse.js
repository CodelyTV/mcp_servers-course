"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestResourceTemplateListResponse = void 0;
class McpTestResourceTemplateListResponse {
    constructor(name, title, uriTemplate, description) {
        this.name = name;
        this.title = title;
        this.uriTemplate = uriTemplate;
        this.description = description;
    }
    static fromPrimitives(resourceTemplate) {
        return new McpTestResourceTemplateListResponse(resourceTemplate.name, resourceTemplate.title, resourceTemplate.uriTemplate, resourceTemplate.description);
    }
}
exports.McpTestResourceTemplateListResponse = McpTestResourceTemplateListResponse;
