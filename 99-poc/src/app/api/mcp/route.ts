import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
	(server) => {
		server.tool(
			"roll_dice",
			"Rolls an N-sided die",
			{ sides: z.number().int().min(2) },
			async ({ sides }) => {
				const value = 1 + Math.floor(Math.random() * sides);

				return {
					content: [
						{ type: "text", text: `🎲 You rolled a ${value}!` },
					],
				};
			},
		);
	},
	{},
	{ basePath: "/api" },
);

export { handler as DELETE, handler as GET, handler as POST };
