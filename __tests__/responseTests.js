import React from 'react';
import { shallow, configure } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import ResponseContainer from '../src/client/components/containers/ResponseContainer.jsx';
import ResponseTabs from '../src/client/components/display/ResponseTabs.jsx';
import ResponseEventsDisplay from '../src/client/components/display/ResponseEventsDisplay.jsx';
import ResponseSubscriptionDisplay from '../src/client/components/display/ResponseSubscriptionDisplay.jsx';

configure({ adapter: new Adapter() });

describe('ResponseContainer', () => {
  let props;
  beforeAll(() => {
    props = {
      content: {
        request: {
          method: null
        },
      }
    }
  });

  it('should render Response Headers when selected', () => {
    const wrapper = shallow(<ResponseContainer {...props} />);
    wrapper.setState({ openTab: 'Response Headers' });
    expect(wrapper.find('ResponseHeadersDisplay')).toBeTruthy();
  });

  it('should render Response Cookies when selected', () => {
    const wrapper = shallow(<ResponseContainer {...props} />);
    wrapper.setState({ openTab: 'Response Cookies' });
    expect(wrapper.find('ResponseCookiesDisplay')).toBeTruthy();
  });

  it('should render ResponseSubscriptionDisplay for GQL Subscriptions', () => {
    const subscriptionProps = {
      content: {
        request: { method: 'SUBSCRIPTION' }
      }
    }
    const wrapper = shallow(<ResponseContainer {...subscriptionProps} />);
    expect(wrapper.find('ResponseSubscriptionDisplay')).toBeTruthy();
  });

  it('should render ResponseEventsDisplay for all other requests', () => {
    const wrapper = shallow(<ResponseContainer {...props} />);
    expect(wrapper.find('ResponseEventsDisplay')).toBeTruthy();
  });
});

describe('ResponseTabs', () => {
  it('should render three tabs', () => {
    const wrapper = shallow(<ResponseTabs />);
    expect(wrapper.find('Tab')).toHaveLength(3);
  });
});

describe('ResponseEventsDisplay', () => {
  it('if SSE, should render event rows', () => {
    const props = {
      response: {
        headers: { 'content-type': 'text/event-stream' },
        events: ['event 1', 'event 2'],
      }
    };
    const wrapper = shallow(<ResponseEventsDisplay {...props} />);
    expect(wrapper.find('SSERow')).toHaveLength(2);
  });
  it('if not SSE, should render single event', () => {
    const props = {
      response: {
        headers: null,
        events: ['event 1'],
      }
    };
    const wrapper = shallow(<ResponseEventsDisplay {...props} />);
    expect(wrapper.find('.json-response')).toHaveLength(1);
  });
});

describe('ResponseSubscriptionDisplay', () => {
  let props;
  let wrapper;
  const testURL = 'https://swell-test-graphql.herokuapp.com';
  beforeAll(() => {
    props = {
      content: {
        url: testURL,
        protocol: 'https://',
        connection: 'open',
        request: {
          body: `subscription {
            newLink {
              id
              url
              description
              postedBy {
                id
                name
                email
              }
            }
          }`,
        },
        response: {
          events: [],
        }
      },
      reqResUpdate: jest.fn(),
    };
    wrapper = renderer.create(<ResponseSubscriptionDisplay {...props} />);

  });
  xit('should initialize as listening', () => {
    expect(wrapper).toMatchSnapshot();
  });
});