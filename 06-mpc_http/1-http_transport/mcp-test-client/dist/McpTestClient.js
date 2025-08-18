"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpTestClient = void 0;
const index_1 = require("@modelcontextprotocol/sdk/client/index");
const stdio_1 = require("@modelcontextprotocol/sdk/client/stdio");
const streamableHttp_1 = require("@modelcontextprotocol/sdk/client/streamableHttp");
const McpTestPromptGetResponse_1 = require("./prompts/McpTestPromptGetResponse");
const McpTestPromptsListResponse_1 = require("./prompts/McpTestPromptsListResponse");
const McpTestResourceTemplatesListResponse_1 = require("./resource-templates/McpTestResourceTemplatesListResponse");
const McpTestResourcesListResponse_1 = require("./resources/McpTestResourcesListResponse");
const McpTestResourcesReadResponse_1 = require("./resources/McpTestResourcesReadResponse");
const McpTestToolCallResponse_1 = require("./tools/McpTestToolCallResponse");
const McpTestToolsListResponse_1 = require("./tools/McpTestToolsListResponse");
class McpTestClient {
    constructor(transport, args) {
        this.args = args;
        this.client = new index_1.Client({
            name: "mcp-test-client",
            version: "1.0.0",
        }, {
            capabilities: {
                resources: {},
                tools: {},
                prompts: {},
            },
        });
        if (transport === "stdio") {
            this.transport = new stdio_1.StdioClientTransport({
                command: this.args[0],
                args: this.args.slice(1),
            });
        }
        else {
            this.transport = new streamableHttp_1.StreamableHTTPClientTransport(new URL(this.args[0]));
        }
    }
    async connect() {
        await this.client.connect(this.transport);
    }
    async disconnect() {
        await this.client.close();
    }
    async listTools() {
        const response = await this.client.listTools();
        return McpTestToolsListResponse_1.McpTestToolsListResponse.fromPrimitives(response);
    }
    async listResources() {
        const response = await this.client.listResources();
        return McpTestResourcesListResponse_1.McpTestResourcesListResponse.fromPrimitives(response);
    }
    async listResourceTemplates() {
        const response = await this.client.listResourceTemplates();
        return McpTestResourceTemplatesListResponse_1.McpTestResourceTemplatesListResponse.fromPrimitives(response);
    }
    async completeResourceTemplateParam(uri, paramName, textToComplete) {
        const response = await this.client.complete({
            ref: {
                type: `ref/resource`,
                uri,
            },
            argument: {
                name: paramName,
                value: textToComplete,
            },
        });
        return response.completion.values;
    }
    async readResource(uri) {
        const response = await this.client.readResource({ uri });
        return McpTestResourcesReadResponse_1.McpTestResourcesReadResponse.fromPrimitives(response);
    }
    async callTool(name, args = {}) {
        const response = await this.client.callTool({
            name,
            arguments: args,
        });
        return McpTestToolCallResponse_1.McpTestToolCallResponse.fromPrimitives(response);
    }
    async listPrompts() {
        const response = await this.client.listPrompts();
        return McpTestPromptsListResponse_1.McpTestPromptsListResponse.fromPrimitives({
            prompts: response.prompts.map((prompt) => ({
                name: prompt.name,
                title: prompt.title ?? "",
                description: prompt.description ?? "",
                args: prompt.arguments ?? {},
            })),
        });
    }
    async getPrompt(name, args = {}) {
        const response = await this.client.getPrompt({
            name,
            arguments: Object.fromEntries(Object.entries(args).map(([key, value]) => [
                key,
                String(value),
            ])),
        });
        return McpTestPromptGetResponse_1.McpTestPromptGetResponse.fromPrimitives({
            messages: response.messages.map((message) => ({
                role: message.role,
                content: message.content.type === "text"
                    ? {
                        type: message.content.type,
                        text: message.content.text,
                    }
                    : message.content,
            })),
        });
    }
}
exports.McpTestClient = McpTestClient;
