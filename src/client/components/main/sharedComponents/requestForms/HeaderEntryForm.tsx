/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-duplicate-props */

import React from 'react';
import ContentReqRowComposer from './ContentReqRowComposer';
import { useState, useEffect } from 'react';
import { NewRequestHeadersSet } from '../../../../../types';

interface Header {
  id: string | number;
  active: boolean;
  key: string;
  value: string | number | boolean;
}

interface RequestFields {
  gRPC: any;
  method: string;
}

interface RequestBody {
  bodyType: string;
  rawType: string;
}

interface Headers {
  headersArr: Header[];
  count: number;
  override?: boolean;
}

interface HeaderEntryFormProps {
  isDark?: boolean;
  newRequestFields: RequestFields;
  newRequestBody: RequestBody;
  newRequestHeaders: Headers;
  newRequestStreams: any;
  newRequestStreamsSet: any;
  newRequestHeadersSet: NewRequestHeadersSet;
}

const HeaderEntryForm = (props: HeaderEntryFormProps): JSX.Element => {
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    const headersDeepCopy = JSON.parse(JSON.stringify(props.newRequestHeaders.headersArr));
    const lastHeader = headersDeepCopy[headersDeepCopy.length - 1];
    if (lastHeader?.key !== '' && lastHeader?.key.toLowerCase() !== 'content-type') {
      addHeader();
    }
    checkContentTypeHeaderUpdate();
  }, [props.newRequestHeaders.headersArr]);

  const contentHeaderNeeded = (): boolean => {
    const { method } = props.newRequestFields;
    return (
      method === 'PUT' ||
      method === 'PATCH' ||
      method === 'DELETE' ||
      method === 'POST' ||
      props.newRequestBody.bodyType === 'GQL' ||
      props.newRequestBody.bodyType === 'GQLvariables'
    );
  };

  const checkContentTypeHeaderUpdate = (): void => {
    let contentType;
    if (
      props.newRequestBody.bodyType === 'GRPC' ||
      props.newRequestBody.bodyType === 'none'
    ) {
      contentType = '';
    } else if (props.newRequestBody.bodyType === 'x-www-form-urlencoded') {
      contentType = 'x-www-form-urlencoded';
    } else if (props.newRequestBody.bodyType === 'binary') {
      contentType = 'application/binary';
    } else if (
      props.newRequestBody.bodyType === 'GQL' ||
      props.newRequestBody.bodyType === 'GQLvariables'
    ) {
      contentType = 'application/json';
    } else {
      contentType = props.newRequestBody.rawType;
    }

    // Attempt to update header in these conditions:
    const foundHeader = props.newRequestHeaders.headersArr.find((header) =>
      header.key.toLowerCase().includes('content-type')
    );
    // 1. if there is no contentTypeHeader, but there should be
    if (!foundHeader && contentType !== '' && contentHeaderNeeded()) {
      addContentTypeHeader(contentType);
      // updateContentTypeHeader(contentType, foundHeader);
    }
    // 2. if there is a contentTypeHeader, but there SHOULDNT be, but the user inputs anyway... just let them
    else if (foundHeader && contentType === '') {
      // keeping this else if lets the user do what they want, it's fine, updateContentTypeHeader and removeContentTypeHeader will fix it later
    }
  };
    // 3. if there is a contentTypeHeader, needs to update
  //     // else if (
  //     //   foundHeader &&
  //     //   foundHeader.value !== contentType &&
  //     //   this.contentHeaderNeeded()
  //     // ) {
  //     //   this.updateContentTypeHeader(contentType, foundHeader);
  //     // }
  //   }

  const addContentTypeHeader = (contentType: string): void => {
    if (!contentHeaderNeeded()) return;
    const headersDeepCopy = JSON.parse(
      JSON.stringify(
        props.newRequestHeaders.headersArr.filter(
          (header) => header.key.toLowerCase() !== 'content-type'
        )
      )
    );
    
    const contentTypeHeader: Header = {
      id: Math.random() * 1000000,
      active: true,
      key: 'Content-Type',
      value: contentType,
    };
    headersDeepCopy.unshift(contentTypeHeader);
    headersDeepCopy.splice(1,1);
    // headersDeepCopy[0] = contentTypeHeader
    props.newRequestHeadersSet({
      headersArr: headersDeepCopy,
      count: headersDeepCopy.length,
    });
  };

  const addHeader = () => {
    const headersDeepCopy = JSON.parse(
      JSON.stringify(props.newRequestHeaders.headersArr)
    );
    headersDeepCopy.push({
      id: Math.random() * 1000000,
      active: false,
      key: '',
      value: '',
    });

    
    props.newRequestHeadersSet({
        headersArr: headersDeepCopy,
        override: false,
        count: headersDeepCopy.length,
      });
    }
  
    // Must be arrow function
  const onChangeUpdateHeader = (id: string,
    field: 'key' | 'value' | 'active',
    value: boolean | string | number,
  ) => {
    const headersDeepCopy = JSON.parse(
      JSON.stringify(props.newRequestHeaders.headersArr)
    );
    // find header to update
    let indexToBeUpdated: number = -1;

    for (let i = 0; i < headersDeepCopy.length; i += 1) {
      if (headersDeepCopy[i].id === id) {
        indexToBeUpdated = i;
        break;
      }
    }
    // if it's the content-type header, just exit
    const isFirst = indexToBeUpdated === 0;
    // if (isFirst) return;
  
      headersDeepCopy[indexToBeUpdated][field] = value;

    // also switch checkbox if they are typing
      if (field === 'key' || field === 'value') {
        headersDeepCopy[indexToBeUpdated].active = true;
      }
    
    // update


    props.newRequestHeadersSet({
      headersArr: headersDeepCopy,
      count: headersDeepCopy.length,
    });
  };

  // Must be arrow function
  const toggleShow = () => {
    setShow(!show);
  };

  // Must be arrow function
  const deleteHeader = (index: number) => {
    const newHeadersArr = props.newRequestHeaders.headersArr.slice();
    newHeadersArr.splice(index, 1);
    props.newRequestHeadersSet({
      headersArr: newHeadersArr,
      count: newHeadersArr.length,
    });
  };

    let headerName = 'Headers';
    let addHeaderName = '+';
    // let headerClass = 'composer_submit http'
    if (props.newRequestFields.gRPC) {
      headerName = 'Metadata';
      addHeaderName = '+';
    }

    const headersArr = props.newRequestHeaders.headersArr.map(
      (header, index) => (
        <ContentReqRowComposer
          data={header}
          index={index}
          type="header-row"
          deleteItem={deleteHeader}
          changeHandler={onChangeUpdateHeader}
          key={index} //key
        />
      )
    );

    return (
      <div className="mt-2" style={{ margin: '10px' }}>
        <div className="is-flex is-align-content-center">
          <div className="composer-section-title">{headerName}</div>
          <button
            className={`${
              props.isDark ? 'is-dark-200' : ''
            } button is-small add-header-gRPC-cookie-button ml-2`}
            id="add-header"
            style={{ height: '3px', width: '3px' }}
            onClick={() => addHeader()}
          >
            {addHeaderName}
          </button>
        </div>
        <div>{headersArr}</div>
      </div>
    );
}

export default HeaderEntryForm;