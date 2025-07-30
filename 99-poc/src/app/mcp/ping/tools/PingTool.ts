/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const PingTool = {
	name: "ping",
	description: {
		title: "Ping Tool",
		description: "Health check - confirms the server is running",
		inputSchema: {},
	},
	handler: async () => ({
		content: [
			{
				type: "text" as const,
				text: "Pong! Courses MCP server is running correctly.",
			},
		],
	}),
};
