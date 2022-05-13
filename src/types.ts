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
type data = { [key: string]: string };

export interface Collection {
  id: string;
  name: string;
  createdAt: Date;
  modifiedAt: Date;
  reqResArray: ReqRes[];
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
  profile: object;
  repos: Collection[];
  files: object[];
}

export interface GraphQLResponse {
  reqResObj: ReqRes;
  data: data; //| Record<string, Record<string, unknown[]>>[];
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
  response: ReqResResponse; // This was previously: Record<string, string[]> | Record<string, Record<string, string | boolean>>;
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

// TODO: this could be implemented
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

// TODO: implement these types
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

