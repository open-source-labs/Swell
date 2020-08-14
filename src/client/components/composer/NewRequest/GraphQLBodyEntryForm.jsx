import React, { useState, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror-graphql/mode';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/theme/monokai.css';
import 'codemirror/addon/lint/lint';
import 'codemirror-graphql/lint';

import GraphQLVariableEntryForm from './GraphQLVariableEntryForm.jsx';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'

const GraphQLBodyEntryForm = React.forwardRef((props, CodeMirrorDOMNode) => {
  const [show, setShow] = useState(true);

  // using useRef to get around the fact that CodeMirrorDOMNode.current (as the arguement itself) is null after first render and mount
  // we need it immediately to access editor.getValue() and get the value of the codemirror component without further UI interaction
  CodeMirrorDOMNode = useRef(CodeMirrorDOMNode);

  const toggleShow = () => {
    setShow(!show)
  }

  const { newRequestBody: { bodyContent }, setNewRequestBody, stylesObj, newRequestBody } = props
  const arrowClass = show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
  const bodyContainerClass = show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';

  return (
      <div >
        <div className='composer_subtitle' onClick={ toggleShow } style={ stylesObj }>
          <img className={ arrowClass } src={ dropDownArrow } alt="" />
          Body
        </div>
        <div className={'composer_textarea gql ' + bodyContainerClass} >
          <CodeMirror
            value={ bodyContent }
            options={{
              mode: 'graphql',
              // theme: 'monokai',
              scrollbarStyle: 'null',
              lineNumbers: false,
              lint: true
            }}
            ref={CodeMirrorDOMNode}
            height="15vh"
            // get the body content of codemirror editor object by accessing the DOM node via ref
            // see: https://github.com/uiwjs/react-codemirror/issues/43
            onChange={() => {
              setNewRequestBody({
                ...newRequestBody,
                bodyContent: CodeMirrorDOMNode.current.editor ? CodeMirrorDOMNode.current.editor.getValue() : bodyContent
              })
            }}
          />
        </div>
        <GraphQLVariableEntryForm
          newRequestBody={ newRequestBody }
          setNewRequestBody= { setNewRequestBody }
        />
      </div>
  )
})

export default GraphQLBodyEntryForm;
