export type Protocol = 'http://' | 'ws://';
export type Network = 'rest' | 'ws' | 'webRtc' | 'graphQL' | 'gRpc' | 'openApi';
export type ConnectionStatus = 'uninitialized' | 'error' | 'open' | 'closed';
export type Methods = 'GET'|'PUT'|'PATCH'|'DELETE'|'OPTIONS'|'HEAD'|'TRACE'|'QUERY'|'SUBSCRIPTION'|'INTROSPECTION'|'INITIATOR'|'RECEIVER';
type data = {[key: string]: string;}

export interface initialState {
  currentTab: string;
  reqResArray: NewRequestResponseObject[];
  scheduledReqResArray: NewRequestResponseObject[];  
  history: Record<string, unknown>[];
  collections: Record<string, unknown>[];
  warningMessage: Record<string, string>;
  newRequestOpenAPI: NewRequestOpenAPI;
  newRequestFields: NewRequestFields;
  newRequestHeaders?: NewRequestHeaders;
  newRequestStreams?: NewRequestStreams;
  newRequestCookies?: NewRequestCookies;
  newRequestBody?: NewRequestBody;
  newRequestSSE: NewRequestSSE;
}

export interface NewRequestOpenAPI {
  openApiMetadata: Record<string, unknown>;
  openApiReqArray: NewRequestOpenAPIObject[];
}

export interface NewRequestOpenAPIObject {
  id: number;
  enabled: boolean;
  summary?: string;
  description?: string;
  operationId?: string;
  reqTags: string;
  reqServers: string[];
  method: Methods;
  endpoint: string;
  headers?: NewRequestHeaders;
  parameters?: Record<string, unknown>[];
  urls: string[];
  body?: Map<string, unknown>;
  params?: Record<string, unknown>;
  queries?: Record<string, unknown>;
}
export interface NewRequestResponseObject {
  id: number;
  graphQL: boolean;
  closeCode: number;
  protocol: Protocol;
  request: NewRequestFields;
  response: RequestResponseObjectResponseObject; // This was previously: Record<string, string[]> | Record<string, Record<string, string | boolean>>;
  connection: ConnectionStatus;
  connectionType: string;
  isHTTP2: boolean;
  url: string;
  timeReceived: Date | number;
  timeSent: number;
  rpc: string;
  service: string;
  checked: boolean;
  webRtc: boolean;
  minimized: boolean;
  gRPC: boolean;
  createdAt: Date;
  error: string;
  openapi: boolean;
}
export interface NewRequestFields {
  protocol: Protocol;
  graphQL: boolean;
  gRPC: boolean;
  ws: boolean;
  webRtc: boolean;
  restUrl?: string;
  wsUrl?: string;
  gqlUrl?: string;
  gRpcUrl?: string;
  webRtcUrl?: string;
  url?: string;
  method?: string;
  network: Network;
  testContent: string;
  testResults: string[];
  headers: NewRequestHeaders[]; //-> Might need this -Prince
  cookies: NewRequestCookies[];
  body: string;
  bodyType: string;
  bodyVariables: string;
}

export interface NewRequestHeaders {
  headersArr?: Record<string, unknown>[]; //-> Might not need this -Prince
  count?: number; //-> Might not need this -Prince
  active: boolean;
  key: string;
  value: string;
  id: number;
}

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

export interface NewRequestCookies {
  // cookiesArr: Record<string, unknown>[]; //-> Pretty sure this is not needed -Prince
  // count: number; //-> Pretty sure this is not needed -Prince
  active: boolean;
  key: string;
  value: string;
  id: string;
}

export interface NewRequestBody { //-> wrong. all wrong. -Prince
  bodyContent: string;
  bodyVariables: string;
  bodyType: string;
  rawType: string;
  JSONFormatted: boolean;
  bodyIsNew: boolean;
};

export interface NewRequestSSE {
  isSSE: boolean;
};

export interface Message {
  source: string;
  timeReceived: number;
  data: string;
}

export interface WebSocketWindowProps {
  content: Record<string, unknown>[];
  outgoingMessages: Array<Message>;
  incomingMessages: Array<Message>;
  connection: string;
}

export interface WebSocketMessageProps {
  source: string;
  data: string;
  timeReceived: number;
  index: number;
}

export interface CookieProps {
  cookies: {
    expirationDate: string;
  }
  detail?: string;
  className?: string;
}

export interface HistoryTab {
  history: Record<number, unknown>[];
  collections : Record<string, unknown>[];
}

export interface CollectionsArray {
  createdAt: Date;
  id: string;
  name: string;
  data?: Record<string, unknown>[];
  reqResArray: NewRequestResponseObject[];
}

// GraphQL Controller Interfaces

export interface GraphQLResponseObject {
  reqResObj: NewRequestResponseObject;
  data: data; //| Record<string, Record<string, unknown[]>>[];
  error?: string;
}
export interface GraphQLResponseObjectData {
  data: data;
  loading: boolean;
  networkStatus: number;
  stale: boolean;
}

export interface RequestResponseObjectResponseObject { // this is likely not a comprehensive list of all properties
  cookies: CookieObject[];
  headers: Record<string, unknown>;
  events: Record<string, unknown>[]; // is this the correct type?
  tab: string;
  timeSent: number;
  timeReceived: number;
  url: string;
}

export interface CookieObject {
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

// WebRTC Controller Interfaces

export interface WRTC {
  RTCPeerConnection: RTCPeerConnection | webkitRTCPeerConnection | mozRTCPeerConnection;
  RTCSessionDescription: RTCSessionDescription | webkitRTCSessionDescription | mozRTCSessionDescription;
  RTCIceCandidate: RTCIceCandidate | webkitRTCIceCandidate | mozRTCIceCandidate;
}

export interface WindowExt extends globalThis.Window {
  api: WindowAPIObject;
}

export interface WindowAPIObject {
  removeAllListeners: (event: string) => void;
  receive: (event: string, callback: (data: any) => void) => void;
  send: (event: string, data: any) => void;

}