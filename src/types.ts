export type Protocol = 'http://' | 'ws://';
export type Network = 'rest' | 'ws' | 'webrtc' | 'graphQL' | 'grpc' | 'openapi';
export type ConnectionStatus = 'uninitialized' | 'error' | 'open' | 'closed';
export type Methods = 'GET'|'PUT'|'PATCH'|'DELETE'|'OPTIONS'|'HEAD'|'TRACE'|'QUERY'|'SUBSCRIPTION'|'INTROSPECTION'|'INITIATOR'|'RECEIVER';

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
  openapiMetadata: Record<string, unknown>;
  openapiReqArray: NewRequestOpenAPIObject[];
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
  response: Record<string, unknown>;
  connection: ConnectionStatus;
  connectionType: string;
  isHTTP2: boolean;
  url: string;
  timeReceived: Date;
  timeSent: Date;
  rpc: string;
  service: string;
}
export interface NewRequestFields {
  protocol: Protocol;
  graphQL: boolean;
  gRPC: boolean;
  ws: boolean;
  webrtc: boolean;
  restUrl?: string;
  wsUrl?: string;
  gqlUrl?: string;
  grpcUrl?: string;
  webrtcUrl?: string;
  url?: string;
  method?: string;
  network: Network;
  testContent: string;
  testResults: string[];
}

export interface NewRequestHeaders {
  headersArr: Record<string, unknown>[];
  count: number;
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
  cookiesArr: Record<string, unknown>[];
  count: number;
}

export interface NewRequestBody {
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
}
export interface CookieProps {
  cookies: {
    expirationDate: string;
  }
  detail?: string;
  className?: string;
}
