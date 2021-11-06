export type Protocol = 'http://' | 'ws://';
export type Network = 'rest' | 'ws' | 'webRtc' | 'graphQL' | 'gRpc' | 'openApi';
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
  timeReceived: Date;
  timeSent: number;
  rpc: string;
  service: string;
  checked: boolean;
  webRtc: boolean;
  minimized: boolean;
  gRPC: boolean;
  createdAt: Date;
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
  // headers: NewRequestHeaders; //-> Might need this -Prince
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

export interface GraphQLResponseObject {
  data: GraphQLResponseObjectData; //| Record<string, Record<string, unknown[]>>[];
  reqResObj: NewRequestResponseObject;
  error?: string;
}

export interface GraphQLResponseObjectData {
  data: Record<string, Record<string, unknown[]>>[];
  loading: boolean;
  networkStatus: number;
  stale: boolean;
}

export interface RequestResponseObjectResponseObject { // this is likely not a comprehensive list of all properties
  cookies: string[];
  headers: Record<string, unknown>;
  events: string[]; // is this the correct type?
  tab: string;
  timeSent: number;
  timeReceived: number;
  url: string;
}