import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror-graphql/mode';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/theme/monokai.css';
import 'codemirror/addon/lint/lint';
import 'codemirror-graphql/lint';


import GraphQLVariableEntryForm from './GraphQLVariableEntryForm.jsx';
import dropDownArrow from '../../../../assets/icons/arrow_drop_down_white_192x192.png'


class GraphQLBodyEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }

  handleKeyPress(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      const gqlBodyEntryTextArea = document.querySelector('#gqlBodyEntryTextArea')
      const start = gqlBodyEntryTextArea.selectionStart
      const second = gqlBodyEntryTextArea.value.substring(gqlBodyEntryTextArea.selectionStart)
      // if you call the action/reducer, cursor jumps to bottom, this will update the textarea value without modifying state but it's fine because any subsequent keys will
      // to account for edge case where tab is last key entered, alter addNewReq in ComposerNewRequest.jsx
      // this.props.setNewRequestBody({
      //   ...this.props.newRequestBody,
      //   bodyContent: gqlBodyEntryTextArea.value.substring(0, start) + `  ` + gqlBodyEntryTextArea.value.substring(start)
      // })
      gqlBodyEntryTextArea.value = gqlBodyEntryTextArea.value.substring(0, start) + `  ` + gqlBodyEntryTextArea.value.substring(start)
      gqlBodyEntryTextArea.setSelectionRange(gqlBodyEntryTextArea.value.length - second.length, gqlBodyEntryTextArea.value.length - second.length)
    }
  }

  render() {
    const arrowClass = this.state.show ? 'composer_subtitle_arrow-open' : 'composer_subtitle_arrow-closed';
    const bodyContainerClass = this.state.show ? 'composer_bodyform_container-open' : 'composer_bodyform_container-closed';
    // console.log('value ', (this.node ? this.node.editor.getValue() : 'nothing yet'));
    // this.node ? this.node.editor.getValue() : this.value
    return (
      <div >
        <div className='composer_subtitle' onClick={this.toggleShow} style={this.props.stylesObj}>
          <img className={arrowClass} src={dropDownArrow} />
          Body
        </div>
        <div className={'composer_textarea gql ' + bodyContainerClass} >
          <CodeMirror
            value={this.props.newRequestBody.bodyContent}
            options={{
              mode: 'graphql',
              // theme: 'monokai',
              scrollbarStyle: 'null',
              lineNumbers: false,
              lint: true
            }}
            // width="500px"
            ref={node => this.node = node}
            height="15vh"
            onChange={(e) => {
              this.props.setNewRequestBody({
                ...this.props.newRequestBody,
                bodyContent: this.node ? this.node.editor.getValue() : this.value
              })
            }}
          />

        </div>

        <GraphQLVariableEntryForm
          newRequestBody={this.props.newRequestBody}
          setNewRequestBody={this.props.setNewRequestBody}
        />
      </div>
    );
  }
}

export default GraphQLBodyEntryForm;
