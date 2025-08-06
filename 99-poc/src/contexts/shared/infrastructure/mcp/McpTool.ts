import { z } from "zod";

import { McpToolResponse } from "./McpToolResponse";

export interface McpTool {
	name: string;
	title: string;
	description: string;
	inputSchema: Record<string, z.ZodTypeAny>;

	handler(args?: Record<string, unknown>): Promise<McpToolResponse>;
}
