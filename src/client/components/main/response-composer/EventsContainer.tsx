import React from 'react';
import { useSelector } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
import EmptyState from './EmptyState';
import EventPreview from './EventPreview';
import { EditorView } from '@codemirror/view';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { json } from '@codemirror/lang-json';

interface EventsContainerProps {
  currentResponse: {
    connection: string;
    request: {
      method: string;
      className?: object;
      classEventPreviewsName: string;
    };
    response: {
      events: any[];
      headers?: {
        'content-type'?: string;
      };
    };
    graphQL?: boolean;
  };
}

function EventsContainer({ currentResponse }: EventsContainerProps) {
  const isDark = useSelector((state: any) => state.ui.isDark);

  const { request, response } = currentResponse;
  if (!response || !response.events || response.events.length < 1) {
    return <EmptyState connection={currentResponse.connection} />;
  }
  const { events, headers } = response;
  let responseBody = '';

  // If it's a stream or graphQL subscription
  if (
    (events && events.length > 1) ||
    (headers?.['content-type'] && headers['content-type'].includes('stream')) ||
    (currentResponse.graphQL && request.method === 'SUBSCRIPTION')
  ) {
    let eventType = 'Stream';
    if (currentResponse.graphQL && request.method === 'SUBSCRIPTION') {
      eventType = 'Subscription';
    }

    events.forEach((event: any, idx: number) => {
      const eventStr = JSON.stringify(event, null, 4);
      responseBody += `-------------${eventType} Event ${
        idx + 1
      }-------------\n${eventStr}\n\n`;
    });
  }
  // If it's a single response
  else {
    responseBody = JSON.stringify(events[0], null, 4);
  }

  return (
    <div
      className="tab_content-response overflow-event-parent-container"
      id="events-display"
    >
      {request.method === 'GET' && (
        <EventPreview
          className={`${
            isDark ? 'is-dark-200' : ''
          } overflow-event-child-container`}
          contents={responseBody}
        />
      )}
      <div
        className={`${
          isDark ? 'is-dark-200' : ''
        } overflow-event-parent-container`}
      >
        <CodeMirror
          className="overflow-event-child-container"
          value={responseBody}
          theme={vscodeDark}
          readOnly={true}
          extensions={[json(), EditorView.lineWrapping]}
        />
      </div>
    </div>
  );
}

export default EventsContainer;
