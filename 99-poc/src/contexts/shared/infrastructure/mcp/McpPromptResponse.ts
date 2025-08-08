import { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";

export type McpPromptRole = "user" | "assistant";

export type McpPromptTextContent = {
	type: "text";
	text: string;
};

export type McpPromptMessage = {
	role: McpPromptRole;
	content: McpPromptTextContent;
};

export class McpPromptResponse {
	private constructor(
		readonly description: string | undefined,
		readonly messages: McpPromptMessage[],
	) {}

	static userText(text: string, description?: string): McpPromptResponse {
		return new McpPromptResponse(description, [
			{ role: "user", content: { type: "text", text } },
		]);
	}

	toGetPromptResult(): GetPromptResult {
		return {
			description: this.description,
			messages: this.messages,
		} satisfies GetPromptResult;
	}
}
