import React, { useState, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/theme/darcula.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/lint/lint';
import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/mode';


import GraphQLVariableEntryForm from './GraphQLVariableEntryForm.jsx';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'

const GraphQLBodyEntryForm = props => {
  const [show, setShow] = useState(true);
  const [intro, setIntro] = useState(null);

  const { 
    newRequestBody: { bodyContent }, 
    newRequestBody, 
    setNewRequestBody, 
    stylesObj, 
    introspectionData
  } = props
  
  const CodeMirrorDOMNode = useRef(null);

  const toggleShow = () => {
    setShow(!show)
  }

  useEffect(() => {
    if (introspectionData.clientSchema) {
    setIntro(introspectionData.clientSchema);
    console.log('intro set', intro)
    } 
  }, [introspectionData.clientSchema])

  
  const arrowClass = show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
  const bodyContainerClass = show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';

  return (
      <div >
        <div className='composer_subtitle' onClick={ toggleShow } style={ stylesObj }>
          <img className={ arrowClass } src={ dropDownArrow } alt="" />
          Body
        </div>
        <div className={ bodyContainerClass } style={{ marginBottom: '10px' }}>
          <CodeMirror
            value={ bodyContent }
            options={{
              mode: 'graphql',
              theme: 'darcula',
              scrollbarStyle: 'native',
              lineNumbers: false,
              lint: true,
              hintOptions: true,
            }}
            height="15vh"
            // get the body content of codemirror editor object by accessing the DOM node via ref
            // see: https://github.com/uiwjs/react-codemirror/issues/43
            ref={ CodeMirrorDOMNode }
            onChange={() => {
              setNewRequestBody({
                ...newRequestBody,
                bodyContent: CodeMirrorDOMNode.current ? CodeMirrorDOMNode.current.editor.getValue() : bodyContent
              });

              console.log('intro', intro)
            }}
          />
        </div>
        <GraphQLVariableEntryForm
          newRequestBody={ newRequestBody }
          setNewRequestBody= { setNewRequestBody }
        />
      </div>
  )
}

export default GraphQLBodyEntryForm;
