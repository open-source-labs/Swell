/**
 * @file Defines a collection of types that are meant to be used through the
 * TypeScript application. Not all types need to be here, especially if some
 * type information only makes sense for internal implementations, but most of
 * them should be here.
 */
import { WritableDraft } from 'immer/dist/internal';

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
 * Takes a union of Redux Toolkit actions and turns it into a Toolkit slice
 * reducer object. This takes each action in the union, converts it into a
 * single Toolkit reducer function, and then throws all the new reducer
 * functions into an object at the end.
 */
export type ActionsToSliceReducers<
  State,
  ActionUnion extends { type: string; payload: unknown }
> = {
  // The type isn't used in the final return type
  [Action in ActionUnion as Action['type']]: (
    state: WritableDraft<State>,
    action: Action
  ) => void;
};

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
  expires: string | number;
}
// No uses in codebase
// export interface CookieProps {
//   cookies: {
//     expirationDate: string;
//   };
//   detail?: string;
//   className?: string;
// }

export interface GithubData {
  profile: $TSFixMeObject;
  repos: Collection[];
  files: $TSFixMeObject[];
}

export interface GraphQLResponse {
  reqResObj: ReqRes;
  data: Record<string, string>; //| Record<string, Record<string, unknown[]>>[];
  error?: string;
}

// not used in codebase
// export interface GraphQLResponseData {
//   data: data;
//   loading: boolean;
//   networkStatus: number;
//   stale: boolean;
// }

// not used in codebase
// export interface HistoryTab {
//   history: Record<number, unknown>[];
//   collections: Record<string, unknown>[];
// }

export interface Message {
  source: string;
  timeReceived: number;
  data: string;
}

// TODO: not sure if this is used, looks like not
// export interface NewRequestBody {
//   //-> wrong. all wrong. -Prince
//   bodyContent: string;
//   bodyVariables: string;
//   bodyType: string;
//   rawType: string;
//   JSONFormatted: boolean;
//   bodyIsNew: boolean;
// }

export interface NewRequestCookies {
  // cookiesArr: Record<string, unknown>[]; //-> Pretty sure this is not needed -Prince
  // count: number; //-> Pretty sure this is not needed -Prince
  active: boolean;
  id: string;
  key: string;
  value: string;
}

export interface ReqResRequest {
  body: string;
  bodyType: string;
  bodyVariables: string;
  cookies: NewRequestCookies[];
  graphQL: boolean;
  gRPC: boolean;
  gRpcUrl?: string;
  gqlUrl?: string;
  headers: RequestHeaders[]; //-> Might need this -Prince
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

export interface RequestHeaders {
  active: boolean;
  count?: number; //-> Might not need this -Prince
  headersArr?: Record<string, unknown>[]; //-> Might not need this -Prince
  id: number;
  key: string;
  value: string;
}

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
  headers?: RequestHeaders;
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

  // This prop was previously:
  // Record<string, string[]> | Record<string, Record<string, string | boolean>>
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

/**
 * @todo This interface might not be implemented yet?
 */
export interface NewRequestStreams {
  streamsArr: Record<string, unknown>[];
  count: number;
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

export interface ReqResResponse {
  // this is likely not a comprehensive list of all properties
  cookies: Cookie[];
  headers: Record<string, unknown>;
  events: Record<string, unknown>[]; // is this the correct type?
  tab: string;
  timeSent: number;
  timeReceived: number;
  url: string;
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

