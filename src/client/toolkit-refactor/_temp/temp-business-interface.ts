import { ReqRes, Collection, $TSFixMe, $TSFixMeObject } from '../../types';

// In separate slice file
type NewRequestFields = {
  protocol: string;
  restUrl: string;
  wsUrl: string;
  gqlUrl: string;
  grpcUrl: string;
  webrtcUrl: string;
  url: string;
  method: string;
  graphQL: boolean;
  gRPC: boolean;
  ws: boolean;
  openapi: boolean;
  webrtc: boolean;
  webhook: boolean;
  network: string;
  testContent: string;
  testResults: $TSFixMe[];
  openapiReqObj: Record<string, unknown>;
};

type NewRequestStreams = {
  streamsArr: $TSFixMe[];
  count: number;
  streamContent: $TSFixMe[];
  selectedPackage: $TSFixMe | null;
  selectedRequest: $TSFixMe | null;
  selectedService: $TSFixMe | null;
  selectedServiceObj: $TSFixMe | null;
  selectedStreamingType: $TSFixMe | null;
  initialQuery: $TSFixMe | null;
  queryArr: $TSFixMe | null;
  protoPath: $TSFixMe | null;
  services: $TSFixMe | null;
  protoContent: string;
};

type State = {
  currentTab: string;
  reqResArray: ReqRes[];
  scheduledReqResArray: ReqRes[];
  history: Collection[];
  collections: Collection[];

  /**
   * Defines an object for storing/displaying warning messages. The main part
   * of the type should contain all the properties used across the codebase,
   * but intersecting the type with Record<string, unknown> just in case not all
   * the properties were caught.
   *
   * @todo Get rid of the Record<string, unknown> intersection and make sure all
   * properties in the main part of the type definition
   */
  warningMessage: {
    err?: string;
    body?: string;
    json?: string;
    uri?: string;
  } & Record<string, unknown>;

  newRequestsOpenAPI: {
    openapiMetadata: {
      info: Record<string, unknown>;
      tags: $TSFixMe[];
      serverUrls: $TSFixMe[];
    };
    openapiReqArray: $TSFixMe[];
  };

  newRequestFields: NewRequestFields;
  newRequestHeaders: {
    headersArr: $TSFixMe[];
    count: number;
  };

  newRequestStreams: NewRequestStreams;
  newRequestCookies: {
    cookiesArr: $TSFixMe[];
    count: number;
  };

  newRequestBody: {
    bodyContent: string;
    bodyVariables: string;
    bodyType: string;
    rawType: string;
    JSONFormatted: boolean;
    bodyIsNew: boolean;
  };

  newRequestSSE: {
    isSSE: boolean;
  };

  newRequestOpenAPIObject: {
    request: {
      id: number;
      enabled: boolean;
      reqTags: $TSFixMe[];
      reqServers: $TSFixMe[];
      summary: string;
      description: string;
      operationId: string;
      method: string;
      endpoint: string;
      headers: Record<string, $TSFixMe>;
      parameters: $TSFixMe[];
      body: Record<string, $TSFixMe>;
      urls: $TSFixMe[];
    };
  };

  introspectionData: {
    schemaSDL: $TSFixMe | null;
    clientSchema: $TSFixMe | null;
  };

  dataPoints: Record<string, $TSFixMe>;
  currentResponse: {
    request: {
      network: string;
    };
    response: {
      source: string;
    };
  };
};

