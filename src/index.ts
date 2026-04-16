import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { RavMesserClient } from "./ravmesser-client.js";
import { registerListTools } from "./tools/lists.js";
import { registerSubscriberTools } from "./tools/subscribers.js";
import { registerMessageTools } from "./tools/messages.js";
import { registerPersonalFieldTools } from "./tools/personal-fields.js";
import { registerViewTools } from "./tools/views.js";

async function main() {
  try {
    const client = new RavMesserClient();

    const server = new McpServer({
      name: "Rav Messer (רב מסר) API",
      version: "1.0.0",
    });

    registerListTools(server, client);
    registerSubscriberTools(server, client);
    registerMessageTools(server, client);
    registerPersonalFieldTools(server, client);
    registerViewTools(server, client);

    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Failed to start ravmesser-mcp:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
