import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RavMesserClient } from "../ravmesser-client.js";
import { GetPersonalFieldsSchema, CreatePersonalFieldsSchema, UpdatePersonalFieldsSchema, DeletePersonalFieldsSchema } from "../types/schemas.js";
import type { PersonalFieldsGetResponse, PersonalFieldsCreateResponse, PersonalFieldsUpdateResponse, PersonalFieldsDeleteResponse } from "../types/api.js";

export function registerPersonalFieldTools(server: McpServer, client: RavMesserClient) {
  server.tool(
    "get_personal_fields",
    "Retrieve custom personal fields defined for a Rav Messer list.",
    GetPersonalFieldsSchema.shape,
    async ({ list_id, limit, offset }) => {
      try {
        const result = await client.request<PersonalFieldsGetResponse>("GET", `/lists/${list_id}/personal_fields?limit=${limit}&offset=${offset}`);
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error getting personal fields: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "create_personal_fields",
    "Create new custom personal fields for a Rav Messer list.",
    CreatePersonalFieldsSchema.shape,
    async ({ list_id, personal_fields }) => {
      try {
        const result = await client.request<PersonalFieldsCreateResponse>("POST", `/lists/${list_id}/personal_fields`, { personal_fields: JSON.stringify(personal_fields) });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error creating personal fields: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "update_personal_fields",
    "Update existing custom personal fields for a Rav Messer list.",
    UpdatePersonalFieldsSchema.shape,
    async ({ list_id, personal_fields }) => {
      try {
        const result = await client.request<PersonalFieldsUpdateResponse>("PUT", `/lists/${list_id}/personal_fields`, { personal_fields: JSON.stringify(personal_fields) });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error updating personal fields: ${(error as Error).message}` }], isError: true };
      }
    }
  );

  server.tool(
    "delete_personal_fields",
    "Delete custom personal fields from a Rav Messer list by their IDs.",
    DeletePersonalFieldsSchema.shape,
    async ({ list_id, personal_field_ids }) => {
      try {
        const result = await client.request<PersonalFieldsDeleteResponse>("DELETE", `/lists/${list_id}/personal_fields`, { personal_fields: JSON.stringify(personal_field_ids) });
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Error deleting personal fields: ${(error as Error).message}` }], isError: true };
      }
    }
  );
}
