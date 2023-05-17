const apiMock = {
    receive: jest.fn(),
    removeAllListeners: jest.fn(),
    send: jest.fn(),
  };
  
  global.window = {
    api: apiMock,
  };