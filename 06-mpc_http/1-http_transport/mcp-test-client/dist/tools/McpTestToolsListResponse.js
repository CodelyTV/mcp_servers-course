"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestToolsListResponse = void 0;
const McpTestToolListResponse_1 = require("./McpTestToolListResponse");
class McpTestToolsListResponse {
    constructor(tools) {
        this.tools = tools;
    }
    static fromPrimitives(primitives) {
        return new McpTestToolsListResponse(primitives.tools.map((tool) => McpTestToolListResponse_1.McpTestToolListResponse.fromPrimitives(tool)));
    }
    names() {
        return this.tools.map((tool) => tool.name);
    }
}
exports.McpTestToolsListResponse = McpTestToolsListResponse;
