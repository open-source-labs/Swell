export interface initialState {
  currentTab: string;
  reqResArray: Record<string, unknown>[];
  scheduledReqResArray: Record<string, unknown>[];  
  history: Record<string, unknown>[];
  collections: Record<string, unknown>[];
  warningMessage: Record<string, string>;
  // openapiMetadata?: Record<string, unknown>;
  // openapiReqArray?: Record<string, unknown>[];
  newRequestOpenAPI: Record<string, unknown>;
  newRequestFields: NewRequestFields;
  newRequestHeaders?: NewRequestHeaders;
  newRequestStreams?: NewRequestStreams;
  newRequestCookies?: NewRequestCookies;
  newRequestBody?: NewRequestBody;
  newRequestSSE: NewRequestSSE;
}

export interface newRequestOpenAPI {
  openapiMetadata: Record<string, unknown>;
  openapiReqArray: Record<string, unknown>[];
}

export interface NewRequestObjOpenAPI {
  id: number;
  enabled: boolean;
  reqTags: string;
  summary?: string;
  description?: string;
  operationId?: string;
  reqServers: string[];
  method: string;
  endpoint: string;
  headers?: Record<string, unknown>;
  parameters?: Record<string, unknown>[];
  body?: Map<string, unknown>;
  urls: string[];
  params?: Record<string, unknown>[];
  queries?: Record<string, unknown>[];
}

export interface NewRequestFields {
  protocol: string;
  graphQL: boolean;
  gRPC: boolean;
  ws: boolean;
  webrtc: boolean;
  restUrl?: string;
  wsUrl?: string;
  gqlUrl?: string;
  grpcUrl?: string;
  url?: string;
  method?: string;
  network?: string;
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
