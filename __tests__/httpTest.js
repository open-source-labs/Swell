import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ResponseEventsDisplay from "../src/client/components/display/ResponseEventsDisplay.jsx";
import FieldEntryForm from "../src/client/components/composer/NewRequest/FieldEntryForm";
import SingleReqResContainer from '../src/client/components/containers/SingleReqResContainer'

configure({ adapter: new Adapter() });

describe('HTTP/S requests', () => {
  describe('public API', () => {
    it('it should GET information from a public API', () => {
    })
  })
})