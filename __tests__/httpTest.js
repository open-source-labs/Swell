import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ResponseEventsDisplay from "../src/client/components/display/ResponseEventsDisplay.jsx";
import FieldEntryForm from "../src/client/components/composer/NewRequest/FieldEntryForm";
import SingleReqResContainer from '../src/client/components/containers/SingleReqResContainer'

configure({ adapter: new Adapter() });

xdescribe('HTTP/S requests', () => {
xdescribe('public API', () => {
	it('it should GET information from a public API', () => {
    const props = {
      newRequestFields: {
        method: "GET",
				protocol: "https://",
				url: "https://pokeapi.co/api/v2/pokemon?limit=2"
			}
		};
		const response = {
			content: {
				response: {
					headers: {
						status: 200
					},
					events: [{'count': 964}]
				}
			}
		}
		const fieldWrapper = shallow(<FieldEntryForm {...props} />);
		fieldWrapper.setState({reqResAdd: jest.fn()})
		const wrapper = shallow(<ResponseEventsDisplay {...response} />);
		expect(wrapper.find("JSONPretty")).toHaveLength(1);
	});
})
})