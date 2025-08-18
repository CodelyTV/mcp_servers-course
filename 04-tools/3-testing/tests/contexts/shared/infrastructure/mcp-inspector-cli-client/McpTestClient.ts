/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import { McpTestResourceTemplatesListResponse } from "./resource-templates/McpTestResourceTemplatesListResponse";
import { McpTestResourcesListResponse } from "./resources/McpTestResourcesListResponse";
import { McpTestResourcesReadResponse } from "./resources/McpTestResourcesReadResponse";
import { McpTestToolCallResponse } from "./tools/McpTestToolCallResponse";
import { McpToolsListResponse } from "./tools/McpToolsListResponse";

export class McpTestClient {
	private readonly client: Client;
	private readonly transport: StdioClientTransport;

	constructor(private readonly command: string[]) {
		this.client = new Client(
			{
				name: "test-client",
				version: "1.0.0",
			},
			{
				capabilities: {
					resources: {},
					tools: {},
					prompts: {},
				},
			},
		);

		this.transport = new StdioClientTransport({
			command: this.command[0],
			args: this.command.slice(1),
		});
	}

	async connect(): Promise<void> {
		await this.client.connect(this.transport);
	}

	async disconnect(): Promise<void> {
		await this.client.close();
	}

	async listTools(): Promise<McpToolsListResponse> {
		const response = await this.client.listTools();

		return McpToolsListResponse.fromPrimitives({
			tools: response.tools.map((tool: any) => ({
				name: tool.name,
				title: tool.title ?? "",
				description: tool.description ?? "",
				inputSchema: tool.inputSchema ?? {},
			})),
		});
	}

	async listResources(): Promise<McpTestResourcesListResponse> {
		const response = await this.client.listResources();

		return McpTestResourcesListResponse.fromPrimitives({
			resources: response.resources.map((resource: any) => ({
				name: resource.name,
				uri: resource.uri,
				title: resource.title ?? "",
				description: resource.description ?? "",
			})),
		});
	}

	async listResourceTemplates(): Promise<McpTestResourceTemplatesListResponse> {
		const response = await this.client.listResourceTemplates();

		return McpTestResourceTemplatesListResponse.fromPrimitives({
			resourceTemplates: response.resourceTemplates.map(
				(template: any) => ({
					name: template.name,
					uriTemplate: template.uriTemplate,
					title: template.title ?? "",
					description: template.description ?? "",
				}),
			),
		});
	}

	async readResource(uri: string): Promise<McpTestResourcesReadResponse> {
		const response = await this.client.readResource({ uri });

		return McpTestResourcesReadResponse.fromPrimitives({
			contents: response.contents,
		});
	}

	async callTool(
		name: string,
		args: Record<string, unknown> = {},
	): Promise<McpTestToolCallResponse> {
		const response = await this.client.callTool({
			name,
			arguments: args,
		});

		return McpTestToolCallResponse.fromPrimitives({
			content: (response.content as any[]).map((content: any) => ({
				type: content.type,
				text: content.text,
				data: content.data,
				mimeType: content.mimeType,
				resource: content.resource,
			})),
			structuredContent: (response as any).structuredContent,
			isError: response.isError as boolean,
		});
	}
}
