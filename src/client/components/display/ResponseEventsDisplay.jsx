import React from "react";
import JSONPretty from "react-json-pretty";
import createDOMPurify from "dompurify";
import SSERow from "./SSERow.jsx";

const ResponseEventsDisplay = (props) => {
  const { events, headers } = props.content.response;
  const displayContents = [];
  const className = props.content.connection === 'error' ? '__json-pretty__error' : '__json-pretty__';

  // If it's an SSE, render event rows
  // console.log('response is : ', response, 'headers is : ', headers)
  if (
    headers &&
    headers["content-type"] &&
    headers["content-type"] === "text/event-stream"
  ) {
    events.forEach((cur, idx) => {
      displayContents.push(<SSERow key={idx} content={cur} />);
    });
  }
  // if the response content-type, purify and render html
  else if (
    headers &&
    headers["content-type"] &&
    headers["content-type"].includes("text/html")
  ) {
    // console.log("headers:content-type ->", headers["content-type"]);
    // console.log("events0 -> ", events[0]);
    displayContents.push(
      <div
        className="okay"
        key="http2_html_content"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: createDOMPurify.sanitize(events[0]),
        }}
      />
    );
  } else if (events && events.length > 1) {
    if (events) {
      let resEvents = "";
      let eventJSON;
      for (const event of events) {
        eventJSON = JSON.stringify(event, null, 4);
        resEvents = `${resEvents}
${eventJSON}`;
      }
      displayContents.push(
        <div className="json-response" key="jsonresponsediv">
          <JSONPretty
            data={resEvents}
            // onJSONPrettyError={e => console.error(e)}
            space="4"
            className={className}//theme={{
            //   main: 'line-height:1.3; color: midnightblue; background:#RRGGBB; overflow:auto;',
            //   key: 'color:#0089D0;', // bluetwo
            //   string: 'color:#15B78F;',// greenone
            //   value: 'color:#fd971f;', // a nice orange
            //   boolean: 'color:#E00198;', // gqlpink
            // }}
          />
        </div>
      );
    }
  }

  // Otherwise, render a single display
  else if (events) {
    displayContents.push(
      <div className="json-response" key="jsonresponsediv">
        <JSONPretty
          data={events[0]}
          // onJSONPrettyError={e => console.error(e)}
          space="4"
          className={className}
          // theme={{
          //   main:
          //     "line-height:1.3; color: midnightblue; background:#RRGGBB; overflow:auto;",
          //   key: "color:#0089D0;", // bluetwo
          //   string: "color:#15B78F;", // greenone
          //   value: "color:#fd971f;", // a nice orange
          //   boolean: "color:#E00198;", // gqlpink
          // }}
        />
      </div>
    );
  }

  return <div className="tab_content-response">{displayContents}</div>;
};

export default ResponseEventsDisplay;
