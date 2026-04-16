import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RavMesserClient } from "../ravmesser-client.js";
import { GetMessagesSchema, CreateMessageSchema, UpdateMessageSchema, DeleteMessagesSchema, TestMessageSchema, SendMessageSchema } from "../types/schemas.js";
import type { RavMesserMessage, MessageCreateResponse, MessageUpdateResponse, MessageDeleteResponse, MessageTestResponse, MessageSendResponse } from "../types/api.js";

export function registerMessageTools(server: McpServer, client: RavMesserClient) {
  server.tool(
    "get_messages",
    "Retrieve messages from a Rav Messer list. Filter by message ID or type.",
    GetMessagesSchema.shape,
    async ({ list_id, message_id, limit, offset, type }) => {
      try {
        let path = `/lists/${list_id}/messages`;
        if (message_id) path += `/${message_id}`;
        path += `?limit=${limit}&offset=${offset}`;
        if (type && type.length > 0) path += `&type=${encodeURIComponent(JSON.stringify(type))}`;
        const result = await client.request<RavMesserMessage[]>("GET", path);
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error getting messages: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_message",
    "Create a new email message in a Rav Messer list. Specify type, subject, and HTML/text body.",
    CreateMessageSchema.shape,
    async ({ list_id, type: msgType, body_type, subject, body, filter, language, check_links }) => {
      try {
        const info: Record<string, unknown> = { TYPE: msgType, BODY_TYPE: body_type, SUBJECT: subject, BODY: body };
        if (filter !== undefined) info.FILTER = filter;
        if (language) info.LANGUAGE = language;
        if (check_links !== undefined) info.CHECK_LINKS = check_links;
        const result = await client.request<MessageCreateResponse>("POST", `/lists/${list_id}/messages`, { info: JSON.stringify(info) });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error creating message: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_message",
    "Update an existing message in a Rav Messer list.",
    UpdateMessageSchema.shape,
    async ({ list_id, message_id, type: msgType, body_type, subject, body, filter, language, check_links }) => {
      try {
        const info: Record<string, unknown> = { ID: message_id };
        if (msgType !== undefined) info.TYPE = msgType;
        if (body_type !== undefined) info.BODY_TYPE = body_type;
        if (subject) info.SUBJECT = subject;
        if (body) info.BODY = body;
        if (filter !== undefined) info.FILTER = filter;
        if (language) info.LANGUAGE = language;
        if (check_links !== undefined) info.CHECK_LINKS = check_links;
        const result = await client.request<MessageUpdateResponse>("PUT", `/lists/${list_id}/messages/${message_id}`, { info: JSON.stringify(info) });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error updating message: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "delete_messages",
    "Delete one or more messages from a Rav Messer list.",
    DeleteMessagesSchema.shape,
    async ({ list_id, messages_ids }) => {
      try {
        const result = await client.request<MessageDeleteResponse>("DELETE", `/lists/${list_id}/messages`, { messages_ids: JSON.stringify(messages_ids) });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error deleting messages: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "test_message",
    "Send a test email of a message to a specific recipient. Use before sending to the full list.",
    TestMessageSchema.shape,
    async ({ list_id, message_id, name, email, phone, personal_fields }) => {
      try {
        const info: Record<string, unknown> = { name, email };
        if (phone) info.phone = phone;
        if (personal_fields) info.personal_fields = personal_fields;
        const result = await client.request<MessageTestResponse>("POST", `/lists/${list_id}/messages/${message_id}/test`, { info: JSON.stringify(info) });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error testing message: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "send_message",
    "Send a message to all subscribers in a Rav Messer list. This triggers actual email delivery.",
    SendMessageSchema.shape,
    async ({ list_id, message_id }) => {
      try {
        const result = await client.request<MessageSendResponse>("POST", `/lists/${list_id}/messages/${message_id}`, {});
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error sending message: ${(error as Error).message}` }], isError: true };
      }
    }
  );
}
