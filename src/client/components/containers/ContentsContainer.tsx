import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../actions/actions';
import BarGraph from "../display/BarGraph"
import WorkspaceContainer from "./WorkspaceContainer.jsx";
import CollectionsContainer from "./CollectionsContainer";
import {Controlled as CodeMirror} from 'react-codemirror2';


export const ContentsContainer = () => {
  // const [activeTab, setActiveTab] = useState('workspace');
  const dispatch = useDispatch();
  const activeTab = useSelector(store => store.ui.workspaceActiveTab);
  const currentResponse = useSelector(store => store.business.currentResponse);
  const setActiveTab = (tabName) => dispatch(actions.setWorkspaceActiveTab(tabName));
  const [testInput, setTestInput] = useState("assert.strictEqual(3, '3', 'no coerscion') expect(2).to.equal(2) assert.strictEqual(3, '3', 'no coerscion')");

  const [showGraph, setShowGraph] = useState(false);
  const {api} = window;

  useEffect(()=> {
    api.receive('testResult', (result) => {
      const res = JSON.parse(result);
      if(!res.message) {
        console.log('Test passed!')
      } else {
        console.log(res.message)
      }
    })
  }, [])

  const click = async () => {
    try{
      api.send('testFileSent', testInput)
    }
    catch(e) {
      console.log(e);
    }
  }

  return (
    <div className="column is-one-third is-flex is-flex-direction-column is-tall is-divider-neutral-300" id='workspace'>
      {/* HEADER */}
      <div className="hero is-primary has-text-centered header-bar">
        <h3>Workspace</h3>
      </div>

      {/* TAB SELECTOR */}
      <div className="tabs header-bar">
        <ul className='columns is-gapless'>
          <li className={`column ${activeTab === 'workspace' ? 'is-active' : '' }`}>
            <a 
              onClick={() => setActiveTab('workspace')}
            >Requests
            </a>
          </li>
          <li className={`column ${activeTab === 'saved-workspace' ? 'is-active' : '' }`}>
            <a 
              onClick={() => setActiveTab('saved-workspace')}
            >Saved Workspace
            </a>
          </li>
        </ul>
      </div>
      {/* <input style={{height: '100px'}} id="testInput" type="text"></input> */}
      <CodeMirror
      value={testInput}
      onBeforeChange={(editor,data,value) => setTestInput(value)}
        options={{
          mode: {
            name: "javascript",
            json: true,
          },
          json: true,
          lineNumbers: true,
          tabSize: 4,
          lineWrapping: true,
          pollInterval: 2000,
          readOnly: false,
        }}
      />
      <button onClick={click}>Click</button>
      {/* WORKSPACE CONTENT */}
      <div className="is-flex-grow-3 add-vertical-scroll">

        {activeTab === 'workspace' && 
          <WorkspaceContainer />
        }

        {activeTab === 'saved-workspace' && 
          <CollectionsContainer />
        }

      </div>

      {/* BARGRAPH CONTENT */}
      { currentResponse.id &&
        <div 
          className="is-flex is-align-items-center is-justify-content-center is-graph-footer is-clickable is-border-neutral-300"
          onClick={() => setShowGraph(showGraph === false)}
          >
            {showGraph &&
              'Hide Response History'
            }
            {!showGraph &&
              'View Response History'
            }
        </div>
      }
        {showGraph &&
          <div>
          <BarGraph />
          </div>
        }
    </div>
  );
}
