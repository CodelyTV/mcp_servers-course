#!/usr/bin/env node

import "reflect-metadata";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	InitializeRequestSchema,
	ListResourcesRequestSchema,
	ListToolsRequestSchema,
	ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { getCoursesResource } from "./courses-resource";

const server = new Server(
	{
		name: "codely-mcp-server",
		version: "1.0.0",
	},
	{
		capabilities: {
			resources: {},
			tools: {},
		},
	},
);

server.setRequestHandler(InitializeRequestSchema, async (request) => {
	return {
		protocolVersion: "2025-06-18",
		capabilities: {
			resources: {},
			tools: {},
		},
		serverInfo: {
			name: "courses-mcp-server",
			version: "1.0.0",
		},
	};
});

server.setRequestHandler(ListResourcesRequestSchema, async () => {
	try {
		const coursesResource = await getCoursesResource();

		return {
			resources: coursesResource,
		};
	} catch (error) {
		console.error("Error listing resources:", error);
		throw error;
	}
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
	const { uri } = request.params;

	try {
		if (uri === "courses://all") {
			const coursesResource = await getCoursesResource();
			const resource = coursesResource[0];

			return {
				contents: [
					{
						uri: resource.uri,
						mimeType: resource.mimeType,
						text: resource.text,
					},
				],
			};
		}

		throw new Error(`Resource not found: ${uri}`);
	} catch (error) {
		console.error("Error reading resource:", uri, error);
		throw error;
	}
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [
			{
				name: "ping",
				description: "Health check - confirms the server is running",
				inputSchema: {
					type: "object",
					properties: {},
				},
			},
		],
	};
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name } = request.params;

	if (name === "ping") {
		return {
			content: [
				{
					type: "text",
					text: "Pong! Courses MCP server is running correctly.",
				},
			],
		};
	}

	throw new Error(`Unknown tool: ${name}`);
});

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Courses MCP Server running on stdio");
}

if (require.main === module) {
	main().catch((error) => {
		console.error("Server error:", error);
		process.exit(1);
	});
}
