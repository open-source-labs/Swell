import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// Import local components
import Http2Container from './http2/Http2Container';

// Import MUI components
import { Box } from '@mui/material';

export default function MainContainer() {
  return(
    <Box>
      <Routes>
        <Route
          path="/"
          element={<Http2Container />}
        />
        <Route
          path="/graphql"
          element={<p>/gql</p>}
        />
        <Route
          path="/grpc"
          element={<p>/grpc</p>}
        />
        <Route
          path="/websocket"
          element={<p></p>}
        />
        <Route
          path="/webrtc"
          element={<p></p>}
        />
        <Route
          path="/openapi"
          element={<p></p>}
        />
        <Route
          path="/webhook"
          element={<p></p>}
        />
      </Routes>
    </Box>
  )
}
