/* eslint-disable @typescript-eslint/explicit-function-return-type */
import "reflect-metadata";

import { NextRequest, NextResponse } from "next/server";

import { container } from "../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { McpTool } from "../../../contexts/shared/infrastructure/mcp/McpTool";

export const runtime = "nodejs";

function getTools(): McpTool[] {
	try {
		return container
			.findTaggedServiceIdentifiers<McpTool>("mcp-tool")
			.map((identifier) => container.get(identifier));
	} catch (error) {
		console.error("Error loading tools from DI container:", error);

		return [];
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		if (!body.jsonrpc || body.jsonrpc !== "2.0") {
			return NextResponse.json(
				{
					jsonrpc: "2.0",
					error: {
						code: -32600,
						message: "Invalid Request",
					},
					id: body.id || null,
				},
				{ status: 400 },
			);
		}

		const { method, params, id } = body;

		// Manejar diferentes métodos MCP
		switch (method) {
			case "initialize":
				return NextResponse.json({
					jsonrpc: "2.0",
					result: {
						protocolVersion: "2024-11-05",
						serverInfo: {
							name: "codely-mcp-api",
							version: "1.0.0",
						},
						capabilities: {
							tools: {},
						},
					},
					id,
				});

			case "tools/list": {
				const tools = getTools();

				return NextResponse.json({
					jsonrpc: "2.0",
					result: {
						tools: tools.map((tool) => ({
							name: tool.name,
							description: tool.description,
							inputSchema: tool.inputSchema || {
								type: "object",
								properties: {},
							},
						})),
					},
					id,
				});
			}

			case "tools/call": {
				const tools = getTools();
				const tool = tools.find((t) => t.name === params?.name);

				if (!tool) {
					return NextResponse.json({
						jsonrpc: "2.0",
						error: {
							code: -32601,
							message: `Tool not found: ${params?.name}`,
						},
						id,
					});
				}

				try {
					const result = await tool.handler(params?.arguments || {});

					return NextResponse.json({
						jsonrpc: "2.0",
						result: {
							content: result.content,
							isError: result.isError,
						},
						id,
					});
				} catch (error) {
					return NextResponse.json({
						jsonrpc: "2.0",
						error: {
							code: -32603,
							message: `Error executing tool ${params?.name}: ${error}`,
						},
						id,
					});
				}
			}

			default:
				return NextResponse.json({
					jsonrpc: "2.0",
					error: {
						code: -32601,
						message: `Method not found: ${method}`,
					},
					id,
				});
		}
	} catch (error) {
		return NextResponse.json(
			{
				jsonrpc: "2.0",
				error: {
					code: -32603,
					message: `Internal error: ${error}`,
				},
				id: null,
			},
			{ status: 500 },
		);
	}
}
