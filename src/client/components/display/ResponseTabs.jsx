import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import Tab from './Tab.jsx';

const mapStateToProps = store => ({ store });
const mapDispatchToProps = dispatch => ({});

class ResponseTabs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const events = 'Response Events';
    const cookies = 'Response Cookies';
    const headers = 'Response Headers';
<<<<<<< HEAD
=======
    const tabContentShownEvents = [];
    let tabContentShown;

    // Step 1  - Locate responses from store add them to cache array
    const responsesCache = [];
    responsesCache.push(this.props);

    // Step 2  - Increment across all responses in array

    responsesCache.forEach((cur, idx) => {
      const responseEvents = cur.responseContent.events;
      const responseHeaders = cur.responseContent.headers;
      const responseCookies = cur.responseContent.cookies;
      if (responseHeaders) {
        const responseContentType = responseHeaders['content-type'];
        const tabState = this.state.openTabs;

        // Step 3  - Check content type of each response Update to use includes
        if (tabState === 'Response Events') {
          if (responseContentType && responseContentType.includes('text/event-stream')) {
            responseEvents.forEach((cur, idx) => {
              tabContentShownEvents.push(<SSERow key={idx} content={cur} />);
            });
          }
          else {
            responseEvents.forEach((cur, idx) => {
              tabContentShownEvents.push(
                <div className="json-response" key={`jsonresponsediv+${idx}`}>
                <JSONPretty data={cur}  space="4" theme ={{
                  main: 'line-height:1.3; color: midnightblue; background:#RRGGBB; overflow:auto;',
                  key: 'color:#0089D0;', //bluetwo
                  string: 'color:#15B78F;',//greenone
                  value: 'color:#fd971f;', //a nice orange
                  boolean: 'color:#E00198;', //gqlpink
                }}>     
                  </JSONPretty>
                </div>
              );
            })
          }
        }
        else if (tabState === 'Response Headers') {
          const headerObj = this.props.responseContent.headers;
          if (!Object.keys(headerObj).length) {
            tabContentShownEvents.push(<p className="reqResContent" key={`reqResRESContent${idx}`} >No Response Headers</p>)
            return;
          }
          if (!Array.isArray(headerObj) && headerObj) {
            for (const key in headerObj) {
              if (!Array.isArray(cur)) {
                tabContentShownEvents.push(
                  <div className="grid-2" key={key}>
                    <span className="tertiary-title title_offset">{key}</span>
                    <span className="tertiary-title title_offset">
                      {headerObj[key]}
                    </span>
                  </div>,
                );
              }
              else {
                console.log('Header Object was incorrect');
              }
            }
          }
        }
        else if (this.state.openTabs === 'Response Cookies') {
          if (!this.props.responseContent.cookies) {
            tabContentShownEvents.push(<p className="reqResContent" key={`reqResRESContent${idx}`} >No Response Cookies</p>)
            return;
          }
          tabContentShownEvents.push(
            <CookieTable
              className="cookieTable"
              cookies={this.props.responseContent.cookies}
              key="{cookieTable}"
            />,
          );
        }
      }
    });
>>>>>>> dev

    return (
      <ul className="tab_list-response">
        <Tab onTabSelected={this.props.handleTabSelect} tabName={events} key="events" />
        <Tab onTabSelected={this.props.handleTabSelect} tabName={headers} key="headers" />
        <Tab onTabSelected={this.props.handleTabSelect} tabName={cookies} key="cookies" />
      </ul>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResponseTabs);
