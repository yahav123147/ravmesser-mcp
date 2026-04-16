import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RavMesserClient } from "../ravmesser-client.js";
import { GetViewsSchema, CreateViewsSchema, UpdateViewsSchema, DeleteViewsSchema } from "../types/schemas.js";
import type { RavMesserView, ViewsCreateResponse, ViewsUpdateResponse, ViewsDeleteResponse } from "../types/api.js";

export function registerViewTools(server: McpServer, client: RavMesserClient) {
  server.tool(
    "get_views",
    "Retrieve views (filtered subscriber segments) for a Rav Messer list.",
    GetViewsSchema.shape,
    async ({ list_id, limit, offset }) => {
      try {
        const result = await client.request<RavMesserView[]>("GET", `/lists/${list_id}/views?limit=${limit}&offset=${offset}`);
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error getting views: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_views",
    "Create new views (subscriber segments) in a Rav Messer list.",
    CreateViewsSchema.shape,
    async ({ list_id, views }) => {
      try {
        const result = await client.request<ViewsCreateResponse>("POST", `/lists/${list_id}/views`, { views: JSON.stringify(views) });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error creating views: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_views",
    "Rename existing views in a Rav Messer list.",
    UpdateViewsSchema.shape,
    async ({ list_id, views }) => {
      try {
        const result = await client.request<ViewsUpdateResponse>("PUT", `/lists/${list_id}/views`, { views: JSON.stringify(views) });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error updating views: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "delete_views",
    "Delete views from a Rav Messer list. Note: uses POST with method=delete per API spec.",
    DeleteViewsSchema.shape,
    async ({ list_id, view_ids }) => {
      try {
        const viewObjects = view_ids.map((id) => ({ ID: id }));
        const result = await client.request<ViewsDeleteResponse>("POST", `/lists/${list_id}/views`, {
          method: "delete",
          personal_fields: JSON.stringify(viewObjects),
        });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error deleting views: ${(error as Error).message}` }], isError: true };
      }
    }
  );
}
