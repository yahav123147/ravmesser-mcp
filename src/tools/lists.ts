import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RavMesserClient } from "../ravmesser-client.js";
import { ListListsSchema, CreateListSchema, UpdateListSchema, DeleteListSchema } from "../types/schemas.js";
import type { RavMesserList, ListCreateResponse, ListUpdateResponse, ListDeleteResponse } from "../types/api.js";

export function registerListTools(server: McpServer, client: RavMesserClient) {
  server.tool(
    "list_lists",
    "Retrieve all mailing lists from Rav Messer. Optionally filter by IDs, limit, or offset.",
    ListListsSchema.shape,
    async ({ list_ids, limit, offset }) => {
      try {
        let path = `/lists?limit=${limit}&offset=${offset}`;
        if (list_ids) path += `&list_ids=${encodeURIComponent(list_ids)}`;
        const result = await client.request<RavMesserList[]>("GET", path);
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error listing lists: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_list",
    "Create a new mailing list in Rav Messer.",
    CreateListSchema.shape,
    async ({ description, sender_email, sender_name, site_name, email_notify }) => {
      try {
        const info: Record<string, unknown> = { DESCRIPTION: description, SENDER_EMAIL: sender_email };
        if (sender_name) info.SENDER_NAME = sender_name;
        if (site_name) info.SITE_NAME = site_name;
        if (email_notify) info.EMAIL_NOTIFY = email_notify;
        const result = await client.request<ListCreateResponse>("POST", "/lists", { info: JSON.stringify(info) });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error creating list: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_list",
    "Update settings of an existing mailing list in Rav Messer. Warning: updating EMAIL_NOTIFY replaces existing values.",
    UpdateListSchema.shape,
    async ({ list_id, description, sender_email, sender_name, site_name, email_notify }) => {
      try {
        const info: Record<string, unknown> = {};
        if (description) info.DESCRIPTION = description;
        if (sender_email) info.SENDER_EMAIL = sender_email;
        if (sender_name) info.SENDER_NAME = sender_name;
        if (site_name) info.SITE_NAME = site_name;
        if (email_notify) info.EMAIL_NOTIFY = email_notify;
        const result = await client.request<ListUpdateResponse>("PUT", `/lists/${list_id}`, { info: JSON.stringify(info) });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error updating list: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "delete_list",
    "Permanently delete a mailing list from Rav Messer. This cannot be undone.",
    DeleteListSchema.shape,
    async ({ list_id }) => {
      try {
        const result = await client.request<ListDeleteResponse>("DELETE", `/lists/${list_id}`);
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error deleting list: ${(error as Error).message}` }], isError: true };
      }
    }
  );
}
