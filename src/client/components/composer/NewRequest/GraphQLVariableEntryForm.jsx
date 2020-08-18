import React, { useState, useRef } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/theme/twilight.css';
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/mode';
import 'codemirror/addon/lint/lint.css'

import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'

const GraphQLVariableEntryForm = (props) => {
  const { 
    newRequestBody: { bodyVariables }, 
    newRequestBody, 
    setNewRequestBody, 
    stylesObj,
  } = props

  const [show, setShow] = useState(false);
  const [cmValue, setValue] = useState(bodyVariables)

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
          value={ cmValue }
          options={{            
            mode: 'graphql',
            theme: 'twilight',
            scrollbarStyle: 'native',
            lineNumbers: false,
            lint: true,
            hintOptions: true,
            matchBrackets: true,
            autoCloseBrackets: true,
          }}
          onBeforeChange={(editor, data, value) => {
            setValue(value)
            console.log('before changing')
            console.log(editor);
          }}
          onChange={(editor, data, value) => {
            console.log('changing')
            console.log('value', value);
            setNewRequestBody({
              ...newRequestBody,
              bodyVariables: value
            });
          }}
        />
      </div>
    </div>
  );
}

export default GraphQLVariableEntryForm;
