const http = require('http');
const assert = require('chai').assert;
const SSEController = require('../../main_process/SSEController'); // File being tested
const SSE = require('express-sse');
const EventSource = require('eventsource');
Object.defineProperty(window, 'EventSource', {
  value: EventSource,
});

//mock http and EventSource module
jest.mock('http');
jest.mock('eventsource');

describe('SSEController', () => {
  //define mock data
  const reqResObj = {
    response: { events: [] },
    url: 'www.fakeurl.com',
  };
  const options = { headers: {} };
  const event = {
    sender: {
      send: jest.fn(),
    },
  };
  const timeDiff = 10;
  //clear open connections after each test just in case
  afterEach(() => {
    SSEController.sseOpenConnections = {};
  });

  describe('createStream', () => {
    it('should invoke returnErrorToFrontEnd when passed empty params', async () => {
      await SSEController.createStream(reqResObj, options, event);

      expect(reqResObj.connection).toBe('error');
      expect(reqResObj.response.events.length).toBe(1);
      expect(event.sender.send).toHaveBeenCalledWith('reqResUpdate', reqResObj);
    });

    it('should successfully create a stream', () => {
      const mockResponse = {
        headers: { 'Content-Type': 'text/event-stream' },
        on: jest.fn().mockImplementation((event, listener) => {
          if (event === 'data') {
            listener('mock data');
          }
        }),
        destroy: jest.fn(),
      };
      http.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn(),
        };
      });

      SSEController.createStream(reqResObj, options, event);

      // Assertions
      expect(reqResObj.connection).toBe('open');
      expect(reqResObj.connectionType).toBe('SSE');
      expect(event.sender.send).toHaveBeenCalledWith('reqResUpdate', reqResObj);
      expect(mockResponse.destroy).toHaveBeenCalled();
    });

    it('should handle http.get error response correctly', () => {
      // Mock the http.get method to simulate an error response
      http.get.mockImplementation((url, callback) => {
        const error = new Error('Network Error');
        callback(error);
        return {
          on: jest.fn(),
        };
      });

      // Call the function under test
      SSEController.createStream(reqResObj, options, event);

      // Assertions
      expect(reqResObj.connection).toBe('error');
      expect(event.sender.send).toHaveBeenCalledWith('reqResUpdate', reqResObj);
    });
  });

  describe('closeConnection', () => {
    const fakeSSE = new EventSource('www.fakeurl.com');
    it('should return undefined when invoked on an ID not found in sseOpenConnections', () => {
      expect(SSEController.closeConnection('fakeID')).toBe(undefined);
      expect(fakeSSE.close).not.toHaveBeenCalled();
    });

    it('should close an existing connection found in sseOpenConnections', () => {
      SSEController.sseOpenConnections.fakeID = fakeSSE;
      SSEController.closeConnection('fakeID');
      expect(fakeSSE.close).toHaveBeenCalled();
      expect(SSEController.sseOpenConnections).toEqual({});
    });
  });
});

