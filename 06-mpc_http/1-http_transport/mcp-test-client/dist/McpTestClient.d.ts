import { McpTestPromptGetResponse } from "./prompts/McpTestPromptGetResponse";
import { McpTestPromptsListResponse } from "./prompts/McpTestPromptsListResponse";
import { McpTestResourceTemplatesListResponse } from "./resource-templates/McpTestResourceTemplatesListResponse";
import { McpTestResourcesListResponse } from "./resources/McpTestResourcesListResponse";
import { McpTestResourcesReadResponse } from "./resources/McpTestResourcesReadResponse";
import { McpTestToolCallResponse } from "./tools/McpTestToolCallResponse";
import { McpTestToolsListResponse } from "./tools/McpTestToolsListResponse";
export declare class McpTestClient {
    private readonly args;
    private readonly client;
    private readonly transport;
    constructor(transport: "stdio" | "http", args: string[]);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    listTools(): Promise<McpTestToolsListResponse>;
    listResources(): Promise<McpTestResourcesListResponse>;
    listResourceTemplates(): Promise<McpTestResourceTemplatesListResponse>;
    completeResourceTemplateParam(uri: string, paramName: string, textToComplete: string): Promise<string[]>;
    readResource(uri: string): Promise<McpTestResourcesReadResponse>;
    callTool(name: string, args?: Record<string, unknown>): Promise<McpTestToolCallResponse>;
    listPrompts(): Promise<McpTestPromptsListResponse>;
    getPrompt(name: string, args?: Record<string, unknown>): Promise<McpTestPromptGetResponse>;
}
