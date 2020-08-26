export interface initialState {
  currentTab: string;
  reqResArray: object[];
  history: object[];
  collections: object[];
  warningMessage: string;
  newRequestFields: NewRequestFields;
  newRequestHeaders: NewRequestHeaders;
  newRequestStreams: NewRequestStreams;
  newRequestCookies: NewRequestCookies;
  newRequestBody: NewRequestBody;
  newRequestSSE: NewRequestSSE;
}

export interface NewRequestFields {
  protocol: string;
  url: string;
  method: string;
  graphQL: boolean;
  gRPC: boolean;
}

export interface NewRequestHeaders {
  headersArr: object[];
  count: number;
}

export interface NewRequestStreams {
  streamsArr: object[];
  count: number;
  streamContent: object[];
  selectedPackage: string | null;
  selectedRequest: string | null;
  selectedService: string | null;
  selectedStreamingType: string | null;
  initialQuery: any | null;
  queryArr: object[] | null;
  protoPath: any | null;
  services: object | null;
  protoContent: string;
}

export interface NewRequestCookies {
  cookiesArr: object[];
  count: number;
}

export interface NewRequestBody {
  bodyContent: string;
  bodyVariables: string;
  bodyType: string;
  rawType: string;
  JSONFormatted: boolean;
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
  id: number;
  outgoingMessages: Array<Message>;
  incomingMessages: Array<Message>;
  connection: string;
}
