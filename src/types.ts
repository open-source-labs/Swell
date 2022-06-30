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

/**
 * Represents any possible valid, serializable JSON value, including values
 * nested to any arbitrary level.
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

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

export interface GithubData {
  profile: $TSFixMeObject;
  repos: Collection[];
  files: $TSFixMeObject[];
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
  bodyContent: string;
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

export interface ReqResRequest {
  body: string;
  bodyType: string;
  bodyVariables: string;
  cookies: CookieOrHeader[];
  graphQL: boolean;
  gRPC: boolean;
  gRpcUrl?: string;
  gqlUrl?: string;
  headers: CookieOrHeader[];
  method?: string;
  network: Network;
  protocol: Protocol;
  restUrl?: string;
  testContent: string;
  testResults: string[];
  url?: string;
  webRtc: boolean;
  webRtcUrl?: string;
  ws: boolean;
  wsUrl?: string;
}

/**
 * Describes the results of calling built-in introspection functions in GraphQL.
 */
export type IntrospectionData = {
  schemaSDL: string | null;
  clientSchema: GraphQLSchema | null;
};

/**
 * Defines a whole HTTP request for generating graph data.
 *
 * Type definitions ripped from httpTest file.
 */
export type HttpRequest = {
  id: number;
  /**
   * createdAt should be formatted like a Date object timestamp. Date objects
   * are not valid serializable JSON values, and Redux will complain about them
   */
  createdAt: string;
  protocol: string;
  host: string;
  path: string;
  url: string;
  graphQL: boolean;
  gRPC: boolean;
  timeSent: string | null;
  timeReceived: string | null;
  connection: string;
  connectionType: $TSFixMe | null;
  checkSelected: boolean;
  protoPath: string | null;

  request: {
    method: string;
    headers: $TSFixMeObject[][];
    cookies: $TSFixMe[];
    body: string;
    bodyType: string;
    bodyVariables: string;
    rawType: string;
    isSSE: boolean;
    network: string;
    restUrl: string;
    wsUrl: string;
    gqlUrl: string;
    grpcUrl: string;
  };

  response: { headers: $TSFixMe | null; events: $TSFixMe | null };
  checked: boolean;
  minimized: boolean;
  tab: string;
};

export interface OpenAPIRequest {
  openApiMetadata: Record<string, unknown>;
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

export interface ReqRes {
  checked: boolean;
  closeCode: number;
  connection: ConnectionStatus;
  connectionType: string;
  createdAt: Date;
  error: string;
  graphQL: boolean;
  gRPC: boolean;
  id: number;
  isHTTP2: boolean;
  minimized: boolean;
  openapi: boolean;
  protocol: Protocol;
  request: ReqResRequest;
  response: ReqResResponse;
  rpc: string;
  service: string;
  timeReceived: Date | number;
  timeSent: number;
  url: string;
  webRtc: boolean;
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
  services: Record<string, unknown> | null;
  protoContent: string;
}

/**@todo make sure all properties are correct and add any not listed yet*/
export interface ReqResResponse {
  cookies: Cookie[]; //*HAS 'cookies' property, array of 'cookie' types - CORRECT
  headers: Record<string, unknown>; //*HAS 'headers' property that is an object - has 'date' property?
  events: Record<string, unknown>[]; // is this the correct type? //*HAS 'events' property that IS an array
  tab: string; //have not found this property mentioned yet
  timeSent: number; //should be in 'times' property below instead??
  timeReceived: number; //should be in 'times' property below instead??
  url: string; //have not found this property mentioned yet
  /**@todo */ //BELOW - additional properties not sure about yet/that weren't listed here before
  times?: $TSFixMeObject[]; //main_grpcController array of objects {timeSent: Date, timeReceived: Date}
  testResult?: $TSFixMe; //mainprocess main_graphqlController
  responseSize?: $TSFixMe; //mainprocess main_httpController line 196ish
  status?: $TSFixMeObject; //?? not sure if object, main_httpController line 353ish
  messages?: $TSFixMeObject[]; //main_wsController, array of objects {data: @TSFixMe, timeReceived: Date}
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

/**
 * @todo Figure out what these types should be and then implement them
 */
export interface WRTC {
  RTCPeerConnection:
    | RTCPeerConnection
    | webkitRTCPeerConnection
    | mozRTCPeerConnection;
  RTCSessionDescription:
    | RTCSessionDescription
    | webkitRTCSessionDescription
    | mozRTCSessionDescription;
  RTCIceCandidate: RTCIceCandidate | webkitRTCIceCandidate | mozRTCIceCandidate;
}

