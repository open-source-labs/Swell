import React, { useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/theme/twilight.css';
import 'codemirror/addon/lint/lint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/mode';

import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'

const GraphQLVariableEntryForm = (props) => {
  const [show, setShow] = useState(false);

  // ref to get the Codemirror.editor methods
  const cmVariables = useRef(null);

  const { 
    newRequestBody: { bodyVariables }, 
    newRequestBody, 
    setNewRequestBody, 
    stylesObj,
  } = props

  const arrowClass = show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
  const bodyContainerClass = show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';

  return (
    <div >
      <div className='composer_subtitle' onClick={() => { setShow(!show) }} style={ stylesObj }>
        <img className={ arrowClass } src={ dropDownArrow } alt="" />
        Variables
      </div>
      <div className={ bodyContainerClass } style={{ marginBottom: '10px' }}>
        <CodeMirror
          value={ bodyVariables }
          options={{
            mode: 'graphql',
            theme: 'twilight',
            scrollbarStyle: 'native',
            lineNumbers: false,
            lint: true,
          }}
          height="10vh"
          // get the body content of codemirror editor object by accessing the DOM node via ref
          // see: https://github.com/uiwjs/react-codemirror/issues/43
          ref={ cmVariables }
          onChange={() => {
            console.log('new reqbody variables', newRequestBody)
            setNewRequestBody({
              ...newRequestBody,
              bodyVariables: cmVariables.current ? cmVariables.current.editor.getValue() : bodyVariables
            });
          }}
        />
      </div>
    </div>
  );
}

export default GraphQLVariableEntryForm;
