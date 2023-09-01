import { format, parse } from 'date-fns';
import db from '~/db';

import { appDispatch } from '~/toolkit/store';
import { historySet } from '~/toolkit/slices/historySlice';
import { setSidebarActiveTab } from '~/toolkit/slices/uiSlice';
import { fieldsReplaced } from '~/toolkit/slices/newRequestFieldsSlice';
import {
  newRequestSSESet,
  newRequestCookiesSet,
  newRequestStreamsSet,
  newRequestBodySet,
  newRequestHeadersSet,
} from '~/toolkit/slices/newRequestSlice';

import { type ReqRes, type $TSFixMe } from '~/types';

const historyController = {
  addHistoryToIndexedDb(reqRes: ReqRes): void {
    db.table('history')
      .put(reqRes)
      .catch((err: string) =>
        console.log('Error in addHistoryToIndexedDb', err)
      );
  },
  deleteHistoryFromIndexedDb(id: string): void {
    db.table('history')
      .delete(id)
      .catch((err: string) => console.log('Error in deleteFromHistory', err));
  },
  clearHistoryFromIndexedDb(): void {
    db.table('history')
      .clear()
      .catch((err: string) => console.log(err));
  },
  async getHistory(): Promise<void> {
    try {
      const history: ReqRes[] = await db.table('history').toArray();
      const historyGroupsObj = history.reduce(
        (groups: Record<string, ReqRes[]>, hist: ReqRes) => {
          const date = format(hist.createdAt, 'MM/dd/yyyy');
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(hist);
          return groups;
        },
        {}
      );
      const historyGroupsArr = Object.keys(historyGroupsObj)
        .sort(
          (a, b) =>
            parse(b, 'MM/dd/yyyy', new Date()).valueOf() -
            parse(a, 'MM/dd/yyyy', new Date()).valueOf()
        )
        .map((date: string) => ({
          // this returns an array of objects with K:date T:string and K:array of history objects
          date,
          history: historyGroupsObj[date].sort(
            (a: ReqRes, b: ReqRes) =>
              b.createdAt.valueOf() - a.createdAt.valueOf()
          ),
        }));

      appDispatch(historySet(historyGroupsArr));
    } catch (err) {
      console.error('Error in getHistory', err);
    }
  },
  copyToComposer: (content: $TSFixMe) => {
    const network = content.request.network;

    // let requestFieldObj = {};

    // if (network === 'rest') {
    //   requestFieldObj = {
    //     ...newRequestFields,
    //     method: content.request.method || 'GET',
    //     protocol: content.protocol || 'http://',
    //     url: content.url,
    //     restUrl: content.request.restUrl,
    //     graphQL: content.graphQL || false,
    //     gRPC: content.gRPC || false,
    //     webrtc: content.webrtc || false,
    //     network,
    //     testContent: content.request.testContent,
    //   };
    // }

    // if (network === 'ws') {
    //   requestFieldObj = {
    //     ...newRequestFields,
    //     method: content.request.method || 'GET',
    //     protocol: content.protocol || 'http://',
    //     url: content.url,
    //     wsUrl: content.request.wsUrl,
    //     graphQL: content.graphQL || false,
    //     gRPC: content.gRPC || false,
    //     network,
    //   };
    // }

    // if (network === 'webrtc') {
    //   requestFieldObj = {
    //     ...newRequestFields,
    //     method: content.request.method || 'GET',
    //     protocol: content.protocol || 'http://',
    //     url: content.url,
    //     graphQL: content.graphQL || false,
    //     gRPC: content.gRPC || false,
    //     network,
    //     wsUrl: content.request.wsUrl,
    //     webrtcData: content.webrtcData,
    //   };
    // }

    // if (network === 'graphQL') {
    //   requestFieldObj = {
    //     ...newRequestFields,
    //     method: content.request.method || 'GET',
    //     protocol: content.protocol || 'http://',
    //     url: content.url,
    //     gqlUrl: content.request.gqlUrl,
    //     graphQL: content.graphQL || false,
    //     gRPC: content.gRPC || false,
    //     network,
    //     testContent: content.request.testContent,
    //   };
    // }

    // if (network === 'grpc') {
    //   requestFieldObj = {
    //     ...newRequestFields,
    //     method: content.request.method || 'GET',
    //     protocol: content.protocol || 'http://',
    //     url: content.url,
    //     grpcUrl: content.request.grpcUrl,
    //     graphQL: content.graphQL || false,
    //     gRPC: content.gRPC || false,
    //     network,
    //     testContent: content.request.testContent,
    //   };
    // }

    let headerDeeperCopy;

    if (content.request.headers) {
      headerDeeperCopy = structuredClone(content.request.headers);
      headerDeeperCopy.push({
        id: content.request.headers.length + 1,
        active: false,
        key: '',
        value: '',
      });
    }

    let cookieDeeperCopy;

    if (content.request.cookies && !/ws/.test(content.protocol)) {
      cookieDeeperCopy = structuredClone(content.request.cookies);
      cookieDeeperCopy.push({
        id: content.request.cookies.length + 1,
        active: false,
        key: '',
        value: '',
      });
    }

    const requestHeadersObj = {
      headersArr: headerDeeperCopy || [],
      count: headerDeeperCopy ? headerDeeperCopy.length : 1,
    };

    const requestCookiesObj = {
      cookiesArr: cookieDeeperCopy || [],
      count: cookieDeeperCopy ? cookieDeeperCopy.length : 1,
    };

    const requestBodyObj = {
      webrtcData: content.webrtcData,
      bodyType: content.request.bodyType || 'raw',
      bodyContent: content.request.body || '',
      bodyVariables: content.request.bodyVariables || '',
      rawType: content.request.rawType || 'text/plain',
      JSONFormatted: true,
      bodyIsNew: false,
    };

    appDispatch(fieldsReplaced(requestBodyObj));
    appDispatch(newRequestHeadersSet(requestHeadersObj));
    appDispatch(newRequestCookiesSet(requestCookiesObj));
    appDispatch(newRequestBodySet(requestBodyObj));
    appDispatch(newRequestSSESet(content.request.isSSE));

    if (content && content.gRPC) {
      const streamsDeepCopy = structuredClone(content.streamsArr); //JSON.parse(JSON.stringify(content.streamsArr));
      const contentsDeepCopy = structuredClone(content.streamsContent); //JSON.parse(JSON.stringify(content.streamContent));

      // construct the streams obj from passed in history content & set state in store
      const requestStreamsObj = {
        streamsArr: streamsDeepCopy,
        count: content.queryArr.length,
        streamContent: contentsDeepCopy,
        selectedPackage: content.packageName,
        selectedRequest: content.rpc,
        selectedService: content.service,
        selectedStreamingType: content.request.method,
        initialQuery: content.initialQuery,
        queryArr: content.queryArr,
        protoPath: content.protoPath,
        services: content.servicesObj,
        protoContent: content.protoContent,
      };

      appDispatch(newRequestStreamsSet(requestStreamsObj));
    }

    appDispatch(setSidebarActiveTab('composer'));
  },
};

export default historyController;
