/**
 * @file Defines a collection of types that are meant to be used through the
 * TypeScript application. Not all types need to be here, especially if some
 * type information only makes sense for internal implementations, but most of
 * them should be here.
 */

import { GraphQLSchema } from 'graphql';

/**
 * Defines a type that is only included because it's required for a function
 * signature, but otherwise isn't used at all.
 */
export type $NotUsed = unknown;

/**
 * Defines a placeholder alias for the any type.
 *
 * PLEASE do not use this for new code. This is just here as a bandaid for
 * legacy code that was typed too loosely. The goal should be to get rid of this
 * type.
 */
export type $TSFixMe = any;

/**
 * Defines a placeholder alias for a function that takes any amount of
 * arguments, of any kind, and returns any kind of value.
 *
 * PLEASE do not use this for new code. This is just here as a bandaid for
 * legacy code that was typed too loosely. The goal should be to get rid of this
 * type.
 */
export type $TSFixMeFunction = (...args: any[]) => any;

/**
 * Defines a placeholder for a value that is meant to be an object, but doesn't
 * have information about whether it should have precise properties on it, or
 * should be a Record object.
 *
 * Do NOT use the "object" type in TypeScript; there are basically no properties
 * that you can access from it in a type-safe way. It's next to useless.
 *
 * PLEASE do not use this for new code. This is just here as a bandaid for
 * legacy code that was typed too loosely. The goal should be to get rid of this
 * type.
 */
export type $TSFixMeObject = any;

export type Protocol = 'http://' | 'ws://';
export type Network = 'rest' | 'ws' | 'webRtc' | 'graphQL' | 'gRpc' | 'openApi';
export type ConnectionStatus = 'uninitialized' | 'error' | 'open' | 'closed';
export type Methods =
  | 'GET'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'
  | 'TRACE'
  | 'QUERY'
  | 'SUBSCRIPTION'
  | 'INTROSPECTION'
  | 'INITIATOR'
  | 'RECEIVER';

export interface Collection {
  id: string;
  name: string;
  createdAt: Date;
  modifiedAt: Date;
  reqResArray: ReqRes[];
  reqResRequest: ReqResRequest[];
  data?: Record<string, unknown>[];
  members?: string[];
}

export interface Cookie {
  name: string;
  value: string;
  domain: string;
  hostOnly: boolean;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  session: boolean;

  //may be 'expirationDate' elsewhere in code?? mainprocess main_httpController?
  expires: string | number;
}

export interface GraphQLResponse {
  reqResObj: ReqRes;

  /** Type information for data property may or may not be right */
  data: Record<string, string>;
  error?: string;
}

export interface Message {
  source: string;
  timeReceived: number;
  data: string;
}

export interface NewRequestBody {
  bodyContent: string | undefined;
  bodyVariables: string;
  bodyType: string;
  rawType: string;
  JSONFormatted: boolean;
  bodyIsNew: boolean;
}

export interface CookieOrHeader {
  active: boolean;
  id: string;
  key: string;
  value: string;
}

export interface WebsocketMessages {
  data: string;
  timeReceived: number;
}

interface NewRequestCookies {
  cookiesArr: CookieOrHeader[];
  count: number;
}

interface NewRequestHeaders {
  headersArr: CookieOrHeader[];
  count: number;
}

export type NewRequestHeadersSet = (obj: NewRequestHeaders) => void;
export type NewRequestCookiesSet = (obj: NewRequestCookies) => void;
export type NewRequestBodySet = (obj: NewRequestBody) => void;

/**
 * Defines the type constract for the NewRequestFields state object.
 *
 * @todo See if it makes sense to redefine some of the properties to be
 * template literal types. For example, since restUrl must start with "http://",
 * type string could possibly be replaced with the type `http://${string}`.
 * Not sure if this could cause things to break, though.
 */
export type NewRequestFields = {
  protocol: string | undefined;
  restUrl: string;
  wsUrl: string;
  gqlUrl: string;
  grpcUrl: string;
  webrtcUrl: string;
  url: string;
  method: string;
  graphQL: boolean;
  gRPC: boolean;
  tRPC: boolean;
  ws: boolean;
  openapi: boolean;
  webrtc: boolean;
  webhook: boolean;
  network: string;
  testContent: string;
  testResults: $TSFixMe[];
  openapiReqObj: Record<string, $TSFixMe>;
};

//& DOnt think this is really being used anymore?
//& ACTUALLY look below at ReqRes and seems to be assigned to key 'request'
export interface ReqResRequest {
  // Currently, the body for WebRTC connection is an object
  // and typescript does not support union between string and object very well
  // Ideally we should move the WebRTC body information to a new key value
  // to fully resolve the issue
  body: string;
  bodyType: string;
  bodyVariables: string;
  cookies: CookieOrHeader[];
  grpcUrl?: string;
  gqlUrl?: string;
  isSSE?: boolean;
  headers: CookieOrHeader[];
  method?: string;
  messages?: WebsocketMessages[];
  network: Network;
  rawType: string;
  restUrl?: string;
  testContent: string;
  testResults?: string[];
  url?: string;
  webRtc?: boolean;
  webRtcUrl?: string;
  ws?: boolean;
  wsUrl?: string;
}

/**
 * Describes the results of calling built-in introspection functions in GraphQL.
 */
export type IntrospectionData = {
  schemaSDL: string | null;
  clientSchema: GraphQLSchema | null;
};

export interface OpenAPIRequest {
  openapiMetadata: $TSFixMe; //Record<string, unknown>;
  openApiReqArray: OpenAPIReqData[];
}

export interface OpenAPIReqData {
  id: number;
  enabled: boolean;
  summary?: string;
  description?: string;
  operationId?: string;
  reqTags: string;
  reqServers: string[];
  method: Methods;
  endpoint: string;
  headers?: CookieOrHeader;
  parameters?: Record<string, unknown>[];
  urls: string[];
  body?: Map<string, unknown>;
  params?: Record<string, unknown>;
  queries?: Record<string, unknown>;
}

/**
 * @todo should be refactored as most of this information is repeated in the
 * request property and has led to inconsistent usage accross app
 *
 * ReqRes {
 *  id: number;
 *  request: ReqResReqest;
 *  response: ReqResResponse;
 * }
 *
 * as well as any additional metadata needed as properties that doesn't already
 * exist in the request or response properties
 */
export interface ReqRes {
  trpc: any;
  checked: boolean;
  checkSelected: boolean;
  closeCode?: number;
  connection: ConnectionStatus;
  connectionType: string | null;
  createdAt: Date;
  error?: string;
  graphQL: boolean;
  gRPC: boolean;
  host: string;
  id: string;
  isHTTP2?: boolean;
  minimized: boolean;
  openapi?: boolean;
  protocol: Protocol;
  protoPath: string;
  path: string;
  request: ReqResRequest;
  response: ReqResResponse;
  rpc?: string;
  service?: string;
  tab: string;
  timeReceived: Date | number | null;
  timeSent: number | null;
  url: string;
  webrtc: boolean;
  frequency?: number;
  duration?: number;
  classEventPreviewsName: string;
}

export interface SSERequest {
  isSSE: boolean;
}

export interface NewRequestStreams {
  streamsArr: Record<string, unknown>[];
  count: number;
  selectedServiceObj: $TSFixMeObject | null;
  streamContent: Record<string, unknown>[];
  selectedPackage: string | null;
  selectedRequest: string | null;
  selectedService: string | null;
  selectedStreamingType: string | null;
  initialQuery: unknown | null;
  queryArr: Record<string, unknown>[] | null;
  protoPath: unknown | null;
  services: Record<$TSFixMe, $TSFixMe> | null;
  protoContent: string;
}

export interface TestResult {
  message: string;
  status: string;
}

/**@todo make sure all properties are correct and add properties not listed yet*/
export interface ReqResResponse {
  cookies?: Cookie[];
  headers?: Record<string, unknown>; //*HAS 'headers' property that is an object - has 'date' property?
  events: Record<string, unknown>[]; // is this the correct type? //*HAS 'events' property that IS an array
  tab?: string; //have not found this property mentioned yet should be removed for seperation of concerns
  timeSent?: number; //should be in 'times' property below instead??
  timeReceived?: number; //should be in 'times' property below instead??
  url?: string; //have not found this property mentioned yet
  /**@todo */ //BELOW - additional properties not sure about yet/that weren't listed here before
  times?: $TSFixMeObject[]; //main_grpcController array of objects {timeSent: Date, timeReceived: Date}
  testResult?: TestResult[];
  responseSize?: number; //mainprocess main_httpController line 196ish
  status?: $TSFixMeObject; //?? not sure if object, main_httpController line 353ish
  messages?: WebsocketMessages[];
  connection?: string; //main_wsController
}

export interface WebSocketMessageProps {
  source: string;
  data: string;
  timeReceived: number;
  index: number;
}

export interface WebSocketWindowProps {
  content: Record<string, unknown>[];
  outgoingMessages: Array<Message>;
  incomingMessages: Array<Message>;
  connection: string;
}

export interface WindowExt extends globalThis.Window {
  api: WindowAPI;
}

export interface WindowAPI {
  removeAllListeners: (event: string) => void;
  receive: (event: string, callback: (data: any) => void) => void;
  send: (event: string, data?: any, some?: any) => void;
}

export interface WorkspaceContainerProps {
  currentWorkspaceId: string;
  setWorkspace: React.Dispatch<React.SetStateAction<string>>;
}

