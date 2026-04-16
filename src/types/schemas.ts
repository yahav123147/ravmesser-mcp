import { z } from "zod";

// --- Lists ---

export const ListListsSchema = z.object({
  list_ids: z.string().optional().describe("Comma-separated list IDs to filter, e.g. '123456,78910'"),
  limit: z.number().min(0).max(500).default(500).describe("Max results (0-500, default 500)"),
  offset: z.number().min(0).default(0).describe("Starting position"),
});

export const CreateListSchema = z.object({
  description: z.string().min(1).describe("List name/description"),
  sender_email: z.string().email().describe("Sender email address"),
  sender_name: z.string().optional().describe("Sender display name"),
  site_name: z.string().optional().describe("Website name for the list"),
  email_notify: z.array(z.string().email()).optional().describe("Email addresses to notify on new subscriber"),
});

export const UpdateListSchema = z.object({
  list_id: z.number().describe("ID of the list to update"),
  description: z.string().optional().describe("Updated list name/description"),
  sender_email: z.string().email().optional().describe("Updated sender email"),
  sender_name: z.string().optional().describe("Updated sender display name"),
  site_name: z.string().optional().describe("Updated website name"),
  email_notify: z.array(z.string().email()).optional().describe("Updated notification emails (replaces existing)"),
});

export const DeleteListSchema = z.object({
  list_id: z.number().describe("ID of the list to delete"),
});

// --- Subscribers ---

export const GetSubscribersSchema = z.object({
  list_id: z.number().describe("List ID to get subscribers from"),
  limit: z.number().min(0).max(500).default(500).describe("Max results (0-500)"),
  offset: z.number().min(0).default(0).describe("Starting position"),
  dir: z.number().min(0).max(1).optional().describe("Sort order by subscription date (0=desc, 1=asc)"),
  subscriber_id: z.string().optional().describe("Specific subscriber ID or email to look up"),
  min_join_date: z.string().optional().describe("Minimum join date (YYYY-MM-DD HH:mm)"),
  max_join_date: z.string().optional().describe("Maximum join date (YYYY-MM-DD HH:mm)"),
});

export const CreateSubscribersSchema = z.object({
  list_id: z.number().describe("List ID to add subscribers to"),
  subscribers: z.array(z.object({
    NAME: z.string().describe("Subscriber name"),
    EMAIL: z.string().email().describe("Email address"),
    PHONE: z.string().optional().describe("Phone number"),
    DAY: z.number().default(0).describe("Seniority value (default 0)"),
    SEND_0: z.number().min(0).max(1).default(1).describe("Send first message (1=yes, 0=no)"),
    NOTIFY: z.number().min(0).max(1).default(0).describe("Notify list owner (1=yes, 0=no)"),
    PERSONAL_FIELDS: z.record(z.string()).optional().describe("Custom field ID-value pairs"),
  })).min(1).describe("Array of subscriber objects to create"),
});

export const UpdateSubscribersSchema = z.object({
  list_id: z.number().describe("List ID"),
  subscribers: z.array(z.object({
    IDENTIFIER: z.string().describe("Subscriber ID or email to identify"),
    NAME: z.string().optional().describe("Updated name"),
    EMAIL: z.string().email().optional().describe("Updated email"),
    PHONE: z.string().optional().describe("Updated phone"),
    PERSONAL_FIELDS: z.record(z.string()).optional().describe("Updated custom fields"),
  })).min(1).describe("Array of subscriber updates with IDENTIFIER"),
});

export const DeleteSubscribersSchema = z.object({
  list_id: z.number().describe("List ID"),
  subscribers: z.array(z.object({
    ID: z.number().optional().describe("Subscriber ID"),
    EMAIL: z.string().optional().describe("Subscriber email"),
  })).min(1).describe("Array of subscribers to delete (by ID or EMAIL)"),
});

// --- Messages ---

export const GetMessagesSchema = z.object({
  list_id: z.number().describe("List ID to get messages from"),
  message_id: z.number().optional().describe("Specific message ID to retrieve"),
  limit: z.number().min(0).max(500).default(500).describe("Max results (0-500)"),
  offset: z.number().min(0).default(0).describe("Starting position"),
  type: z.array(z.number().min(0).max(4)).optional().describe("Filter by message type (0-4)"),
});

export const CreateMessageSchema = z.object({
  list_id: z.number().describe("List ID to create the message in"),
  type: z.number().min(0).max(4).describe("Message type (0=regular, 1=autoresponder, 2=split test, 3=trigger, 4=draft)"),
  body_type: z.number().min(0).max(2).describe("Body type (0=HTML editor, 1=drag & drop, 2=plain text)"),
  subject: z.string().min(1).describe("Email subject line"),
  body: z.string().min(1).describe("Email body content (HTML or plain text)"),
  filter: z.number().optional().describe("View ID to filter recipients"),
  language: z.string().optional().describe("Message language code"),
  check_links: z.number().min(0).max(1).optional().describe("Check links in message (1=yes)"),
});

export const UpdateMessageSchema = z.object({
  list_id: z.number().describe("List ID"),
  message_id: z.number().describe("Message ID to update"),
  type: z.number().min(0).max(4).optional().describe("Updated message type"),
  body_type: z.number().min(0).max(2).optional().describe("Updated body type"),
  subject: z.string().optional().describe("Updated subject"),
  body: z.string().optional().describe("Updated body content"),
  filter: z.number().optional().describe("Updated view filter"),
  language: z.string().optional().describe("Updated language"),
  check_links: z.number().min(0).max(1).optional().describe("Check links"),
});

export const DeleteMessagesSchema = z.object({
  list_id: z.number().describe("List ID"),
  messages_ids: z.array(z.number()).min(1).describe("Array of message IDs to delete"),
});

export const TestMessageSchema = z.object({
  list_id: z.number().describe("List ID"),
  message_id: z.number().describe("Message ID to test"),
  name: z.string().describe("Test recipient name"),
  email: z.string().email().describe("Test recipient email"),
  phone: z.string().optional().describe("Test recipient phone"),
  personal_fields: z.record(z.string()).optional().describe("Test personal field values"),
});

export const SendMessageSchema = z.object({
  list_id: z.number().describe("List ID"),
  message_id: z.number().describe("Message ID to send"),
});

// --- Personal Fields ---

export const GetPersonalFieldsSchema = z.object({
  list_id: z.number().describe("List ID"),
  limit: z.number().min(0).max(500).default(500).describe("Max results (0-500)"),
  offset: z.number().min(0).default(0).describe("Starting position"),
});

export const CreatePersonalFieldsSchema = z.object({
  list_id: z.number().describe("List ID"),
  personal_fields: z.array(z.object({
    NAME: z.string().min(1).describe("Field name"),
    DEFAULT_VALUE: z.string().optional().describe("Default value"),
    DIR: z.number().optional().describe("Text direction"),
    TYPE: z.number().optional().describe("Field type"),
  })).min(1).describe("Array of personal fields to create"),
});

export const UpdatePersonalFieldsSchema = z.object({
  list_id: z.number().describe("List ID"),
  personal_fields: z.array(z.object({
    ID: z.number().describe("Field ID to update"),
    NAME: z.string().optional().describe("Updated name"),
    DEFAULT_VALUE: z.string().optional().describe("Updated default value"),
    DIR: z.number().optional().describe("Updated direction"),
    TYPE: z.number().optional().describe("Updated type"),
  })).min(1).describe("Array of personal fields to update"),
});

export const DeletePersonalFieldsSchema = z.object({
  list_id: z.number().describe("List ID"),
  personal_field_ids: z.array(z.number()).min(1).describe("Array of personal field IDs to delete"),
});

// --- Views ---

export const GetViewsSchema = z.object({
  list_id: z.number().describe("List ID"),
  limit: z.number().min(0).max(500).default(500).describe("Max results (0-500)"),
  offset: z.number().min(0).default(0).describe("Starting position"),
});

export const CreateViewsSchema = z.object({
  list_id: z.number().describe("List ID"),
  views: z.array(z.object({
    NAME: z.string().min(1).describe("View name"),
  })).min(1).describe("Array of views to create"),
});

export const UpdateViewsSchema = z.object({
  list_id: z.number().describe("List ID"),
  views: z.array(z.object({
    ID: z.number().describe("View ID to update"),
    NAME: z.string().min(1).describe("Updated view name"),
  })).min(1).describe("Array of views to update"),
});

export const DeleteViewsSchema = z.object({
  list_id: z.number().describe("List ID"),
  view_ids: z.array(z.number()).min(1).describe("Array of view IDs to delete"),
});
