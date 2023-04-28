// Refactored to function components
// cookieentryform

import React, { useState, useEffect } from 'react';
import ContentReqRowComposer from './ContentReqRowComposer';

interface Cookie {
  id: string;
  active: boolean;
  key: string;
  value: string;
}

interface Props {
  newRequestCookies: {
    cookiesArr: Cookie[];
    count: number;
  };
  newRequestCookiesSet: (obj: {
    cookiesArr: Cookie[];
    override?: boolean;
    count: number;
  }) => string;
  isDark: boolean;
}

const CookieEntryForm = (props: Props) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const cookiesDeepCopy = createDeepCookieCopy();
    if (cookiesDeepCopy[cookiesDeepCopy.length - 1]?.key !== '') {
      addCookie(cookiesDeepCopy);
    }
  }, []);

  useEffect(() => {
    const cookiesDeepCopy = createDeepCookieCopy();
    if (cookiesDeepCopy.length === 0) {
      addCookie([]);
    } else if (cookiesDeepCopy[cookiesDeepCopy.length - 1]?.key !== '') {
      addCookie(cookiesDeepCopy);
    }
  });

  const createDeepCookieCopy = () => {
    return JSON.parse(JSON.stringify(props.newRequestCookies.cookiesArr));
  };

  const addCookie = (cookiesDeepCopy: Cookie[]) => {
    cookiesDeepCopy.push({
      id: `cookie${props.newRequestCookies.count}`,
      active: false,
      key: '',
      value: '',
    });

    props.newRequestCookiesSet({
      cookiesArr: cookiesDeepCopy,
      override: false,
      count: cookiesDeepCopy.length,
    });
  };

  const onChangeUpdateCookie = (
    id: string,
    field: 'key' | 'value' | 'active',
    value: boolean | string | number,
  ) => {
    const cookiesDeepCopy = createDeepCookieCopy();

    // find cookie to update
    let indexToBeUpdated: number = -1;
    for (let i = 0; i < cookiesDeepCopy.length; i++) {
      if (cookiesDeepCopy[i].id === id) {
        indexToBeUpdated = i;
        break;
      }
    }

    // update

    cookiesDeepCopy[indexToBeUpdated][field] = value;

    // also switch checkbox if they are typing
    if (field === 'key' || field === 'value') {
      cookiesDeepCopy[indexToBeUpdated].active = true;

    }

    props.newRequestCookiesSet({
      cookiesArr: cookiesDeepCopy,
      count: cookiesDeepCopy.length,
    });

  };

  const deleteCookie = (index: number) => {
    const newCookies = createDeepCookieCopy();
    newCookies.splice(index, 1);
    props.newRequestCookiesSet({
      cookiesArr: newCookies,
      count: newCookies.length,
    });
  };

  const addCookieName = '+';
  const cookiesArr = props.newRequestCookies.cookiesArr.map((cookie, index) => (
    <ContentReqRowComposer
      deleteItem={deleteCookie}
      data={cookie}
      type="cookie-row"
      index={index}
      changeHandler={onChangeUpdateCookie}
      key={index}
    />
  ));

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <div className="mt-2" style={{ margin: '10px' }}>
      <div className="is-flex is-align-content-center">
        <div className="composer-section-title">Cookies</div>
        <button
          className={`${props.isDark ? 'is-dark-200' : ''
            } button add-header-gRPC-cookie-button ml-2`}
          id="add-cookie"
          onClick={() => addCookie(createDeepCookieCopy())}
          style={{ height: '3px', width: '3px' }}
        >
          {addCookieName}
        </button>
      </div>
      <div>{cookiesArr}</div>
    </div>
  );
}

export default CookieEntryForm;


// import React, { Component } from 'react';
// import ContentReqRowComposer from './ContentReqRowComposer.tsx';

// class CookieEntryForm extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       show: false,
//     };
//     this.onChangeUpdateCookie = this.onChangeUpdateCookie.bind(this);
//     this.toggleShow = this.toggleShow.bind(this);
//     this.deleteCookie = this.deleteCookie.bind(this);
//   }

//   componentDidMount() {
//     const cookiesDeepCopy = this.createDeepCookieCopy();
//     if (cookiesDeepCopy[cookiesDeepCopy.length - 1]?.key !== '')
//       this.addCookie(cookiesDeepCopy);
//   }

//   componentDidUpdate() {
//     const cookiesDeepCopy = this.createDeepCookieCopy();
//     if (cookiesDeepCopy.length === 0) {
//       this.addCookie([]);
//     } else if (cookiesDeepCopy[cookiesDeepCopy.length - 1]?.key !== '') {
//       this.addCookie(cookiesDeepCopy);
//     }
//   }

//   createDeepCookieCopy() {
//     return JSON.parse(JSON.stringify(this.props.newRequestCookies.cookiesArr));
//   }

//   addCookie(cookiesDeepCopy) {
//     cookiesDeepCopy.push({
//       id: `cookie${this.props.newRequestCookies.count}`,
//       active: false,
//       key: '',
//       value: '',
//     });

//     this.props.newRequestCookiesSet({
//       cookiesArr: cookiesDeepCopy,
//       override: false,
//       count: cookiesDeepCopy.length,
//     });
//   }

//   onChangeUpdateCookie(id, field, value) {
//     const cookiesDeepCopy = this.createDeepCookieCopy();

//     //find cookie to update
//     let indexToBeUpdated;
//     for (let i = 0; i < cookiesDeepCopy.length; i++) {
//       if (cookiesDeepCopy[i].id === id) {
//         indexToBeUpdated = i;
//         break;
//       }
//     }
//     //update
//     cookiesDeepCopy[indexToBeUpdated][field] = value;

//     //also switch checkbox if they are typing
//     if (field === 'key' || field === 'value') {
//       cookiesDeepCopy[indexToBeUpdated].active = true;
//     }

//     this.props.newRequestCookiesSet({
//       cookiesArr: cookiesDeepCopy,
//       count: cookiesDeepCopy.length,
//     });
//   }

//   deleteCookie = (index) => {
//     const newCookies = this.createDeepCookieCopy();
//     newCookies.splice(index, 1);
//     this.props.newRequestCookiesSet({
//       cookiesArr: newCookies,
//       count: newCookies.length,
//     });
//   };

//   toggleShow() {
//     this.setState({
//       show: !this.state.show,
//     });
//   }

//   render() {
//     const addCookieName = '+';
//     const cookiesArr = this.props.newRequestCookies.cookiesArr.map(
//       (cookie, index) => (
//         <ContentReqRowComposer
//           deleteItem={this.deleteCookie}
//           data={cookie}
//           type="cookie-row"
//           index={index}
//           changeHandler={this.onChangeUpdateCookie}
//           key={index}
//         />
//       )
//     );

//     return (
//       <div className="mt-2" style={{ margin: '10px' }}>
//         <div className="is-flex is-align-content-center">
//           <div className="composer-section-title">Cookies</div>
//           <button
//             className={`${this.props.isDark ? 'is-dark-200' : ''
//               } button add-header-gRPC-cookie-button ml-2`}
//             id="add-cookie"
//             onClick={() => this.addCookie(this.createDeepCookieCopy())}
//             style={{ height: '3px', width: '3px' }}
//           >
//             {addCookieName}
//           </button>
//         </div>
//         <div>{cookiesArr}</div>
//       </div>
//     );
//   }
// }

// export default CookieEntryForm;


