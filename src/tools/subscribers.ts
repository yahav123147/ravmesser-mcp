import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RavMesserClient } from "../ravmesser-client.js";
import { GetSubscribersSchema, CreateSubscribersSchema, UpdateSubscribersSchema, DeleteSubscribersSchema } from "../types/schemas.js";
import type { RavMesserSubscriber, SubscriberCreateResponse, SubscriberUpdateResponse, SubscriberDeleteResponse } from "../types/api.js";

export function registerSubscriberTools(server: McpServer, client: RavMesserClient) {
  server.tool(
    "get_subscribers",
    "Retrieve subscribers from a Rav Messer list. Filter by ID/email, join date range, or paginate.",
    GetSubscribersSchema.shape,
    async ({ list_id, limit, offset, dir, subscriber_id, min_join_date, max_join_date }) => {
      try {
        let path = `/lists/${list_id}/subscribers?limit=${limit}&offset=${offset}`;
        if (dir !== undefined) path += `&dir=${dir}`;
        if (subscriber_id) path += `&subscriber_id=${encodeURIComponent(subscriber_id)}`;
        if (min_join_date) path += `&min_join_date=${encodeURIComponent(min_join_date)}`;
        if (max_join_date) path += `&max_join_date=${encodeURIComponent(max_join_date)}`;
        const result = await client.request<RavMesserSubscriber[]>("GET", path);
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error getting subscribers: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_subscribers",
    "Add one or more subscribers to a Rav Messer list. Supports batch creation with NAME, EMAIL, PHONE, and custom fields.",
    CreateSubscribersSchema.shape,
    async ({ list_id, subscribers }) => {
      try {
        const result = await client.request<SubscriberCreateResponse>(
          "POST", `/lists/${list_id}/subscribers`,
          { subscribers: JSON.stringify(subscribers) }
        );
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error creating subscribers: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_subscribers",
    "Update existing subscribers in a Rav Messer list. Identify by ID or email via IDENTIFIER field.",
    UpdateSubscribersSchema.shape,
    async ({ list_id, subscribers }) => {
      try {
        const result = await client.request<SubscriberUpdateResponse>(
          "PUT", `/lists/${list_id}/subscribers`,
          { subscribers: JSON.stringify(subscribers) }
        );
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error updating subscribers: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "delete_subscribers",
    "Remove subscribers from a Rav Messer list by ID or email.",
    DeleteSubscribersSchema.shape,
    async ({ list_id, subscribers }) => {
      try {
        const result = await client.request<SubscriberDeleteResponse>(
          "DELETE", `/lists/${list_id}/subscribers`,
          { subscribers: JSON.stringify(subscribers) }
        );
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error deleting subscribers: ${(error as Error).message}` }], isError: true };
      }
    }
  );
}
