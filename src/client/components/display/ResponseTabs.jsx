import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import Tab from './Tab.jsx';
import SSERow from './SSERow.jsx';
import CookieTable from './CookieTable.jsx';
import JSONPretty from 'react-json-pretty';

const mapStateToProps = store => ({ store });
const mapDispatchToProps = dispatch => ({});

class ResponseTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTabs: '',
    };
    this.handleTabSelect = this.handleTabSelect.bind(this);
  }

  componentDidMount() {
    this.handleTabSelect('Response Events');
  }

  handleTabSelect(val) {
    switch (val) {
      case 'Response Cookies':
        this.setState({
          openTabs: val,
        });
        break;
      case 'Response Headers':
        this.setState({
          openTabs: val,
        });
        break;
      case 'Response Events':
        this.setState({
          openTabs: val,
        });
        break;
      default:
      // console.log(`There was an error with ${val}`);
    }
  }

  render() {
    const events = 'Response Events';
    const cookies = 'Response Cookies';
    const headers = 'Response Headers';
    const tabContentShownEvents = [];

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
                  <JSONPretty
                    data={cur}
                    theme={{
                      main: 'line-height:1.3;color:#66d9ef;background:#RRGGBB;overflow:auto;',
                      key: 'color:#f92672;',
                      string: 'color:#fd971f;',
                      value: 'color:#a6e22e;',
                      boolean: 'color:#ac81fe;',
                    }} />
                </div>
              );
            })
          }
        }
        else if (tabState === 'Response Headers') {
          const headerObj = this.props.responseContent.headers;
          console.log('responseTabs.jsx headers: ', this.props.responseContent.headers)
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

    return (
      <div>
        <ul className="tab_list-response">
          <Tab onTabSelected={this.handleTabSelect} tabName={events} key="events" />
          <Tab onTabSelected={this.handleTabSelect} tabName={headers} key="headers" />
          <Tab onTabSelected={this.handleTabSelect} tabName={cookies} key="cookies" />
        </ul>
        <div className="tab_content-response">{tabContentShownEvents}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResponseTabs);
