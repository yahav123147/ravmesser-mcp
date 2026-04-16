// src/types/api.ts

// --- Credentials ---

export interface RavMesserCredentials {
  cKey: string;
  cSecret: string;
  uKey: string;
  uSecret: string;
}

// --- List ---

export interface RavMesserList {
  ID: number;
  DESCRIPTION: string;
  SENDER_NAME: string;
  SENDER_EMAIL: string;
  SENDER_NUM: number;
  EMAIL_NOTIFY: string[];
  AUTOMATION: Array<{
    TRIGGER: number;
    LIST_ID: number;
    DELAY_NUM: number;
    DELAY_TYPE: number;
  }>;
  SITE_NAME: string;
  SUBSCRIBERS_COUNT: number;
}

export interface ListCreateResponse {
  LIST_ID: number;
  INVALID_EMAIL_NOTIFY: string[];
  INVALID_LIST_IDS: number[];
}

export interface ListUpdateResponse {
  INVALID_EMAIL_NOTIFY: string[];
  INVALID_LIST_IDS: number[];
  ERRORS: string[];
}

export interface ListDeleteResponse {
  DELETED_LIST_ID: number;
}

// --- Subscriber ---

export interface RavMesserSubscriber {
  ID: number;
  STATUS: number;
  STATUS_NUM: number;
  ACCOUNT_STATUS: number;
  EMAIL: string;
  PHONE: string;
  NAME: string;
  DAY: number;
  PERSONAL_FIELDS: Record<string, string>;
  JOIN_DATE?: string;
}

export interface SubscriberCreateResponse {
  SUBSCRIBERS_CREATED: number;
  EMAILS_INVALID: string[];
  EMAILS_EXISTING: string[];
  EMAILS_BANNED: string[];
  PHONES_INVALID: string[];
  PHONES_EXISTING: string[];
  BAD_PERSONAL_FIELDS: string[];
  ERRORS: string[];
}

export interface SubscriberUpdateResponse {
  SUBSCRIBERS_UPDATED: number;
  INVALID_SUBSCRIBER_IDENTIFIERS: string[];
  EMAILS_INVALID: string[];
  EMAILS_EXISTED: string[];
  EMAILS_BANNED: string[];
  PHONES_INVALID: string[];
  PHONES_EXISTING: string[];
  BAD_PERSONAL_FIELDS: string[];
}

export interface SubscriberDeleteResponse {
  INVALID_SUBSCRIBER_IDS: number[];
  INVALID_SUBSCRIBER_EMAILS: string[];
  DELETED_SUBSCRIBERS: Record<string, string>;
}

// --- Message ---

export interface RavMesserMessage {
  ID: number;
  TYPE: number;
  SUBJECT: string;
  BODY: string;
  BODY_TYPE: number;
  CREATED: string;
  SCHEDULED?: string;
  OPENED?: number;
  CLICKED?: number;
  SENT?: number;
  LANGUAGE?: string;
}

export interface MessageCreateResponse {
  ERRORS: string[];
  MESSAGE_ID: number;
}

export interface MessageUpdateResponse {
  ERRORS: string[];
  MESSAGE_ID: number;
}

export interface MessageDeleteResponse {
  INVALID_MESSAGE_IDS: number[];
  DELETED_MESSAGES: number[];
}

export interface MessageTestResponse {
  STATUS: boolean;
}

export interface MessageSendResponse {
  MESSAGE_SENT: boolean;
}

// --- Personal Field ---

export interface RavMesserPersonalField {
  ID: number;
  NAME: string;
  DEFAULT_VALUE: string;
  DIR: number;
  HIDDEN: number;
  TYPE: number;
}

export interface PersonalFieldsGetResponse {
  LIST_ID: number;
  PERSONAL_FIELDS: RavMesserPersonalField[];
}

export interface PersonalFieldsCreateResponse {
  LIST_ID: number;
  CREATED_PERSONAL_FIELDS: Array<{ ID: number; NAME: string }>;
  EXISTING_PERSONAL_FIELD_NAMES: string[];
}

export interface PersonalFieldsUpdateResponse {
  LIST_ID: number;
  UPDATED_PERSONAL_FIELDS: number[];
  INVALID_PERSONAL_FIELD_IDS: number[];
  EXISTING_PERSONAL_FIELD_NAMES: string[];
}

export interface PersonalFieldsDeleteResponse {
  DELETED_FIELDS: number[];
  INVALID_FIELD_IDS: number[];
}

// --- View ---

export interface RavMesserView {
  ID: number;
  NAME: string;
}

export interface ViewsCreateResponse {
  LIST_ID: number;
  VIEWS: number[];
}

export interface ViewsUpdateResponse {
  LIST_ID: number;
  UPDATED_VIEWS: number[];
  INVALID_VIEWS_IDS: number[];
}

export interface ViewsDeleteResponse {
  DELETED_VIEWS: number[];
  INVALID_VIEW_IDS: number[];
}
