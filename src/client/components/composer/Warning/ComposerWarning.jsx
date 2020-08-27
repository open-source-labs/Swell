import React, { Component } from "react";

const ComposerWarning = ({ warningMessage }) => {
    return (
        <div>
          <div style={{ color: "red" }}>{warningMessage.body}</div>
        </div>
    );
}

// class ComposerWarning extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//     this.hideWarning = this.hideWarning.bind(this);
//   }

//   // hideWarning() {
//   //   this.props.setComposerDisplay("Request");
//   // }

//   render() {
//     return (
//       <>
//         <div
//           className="composer_warning"
//           role="button"
//         >
//           <div style={{ color: "red" }}>{this.props.warningMessage.body}</div>
//         </div>
//       </>
//     );
//   }
// }

export default ComposerWarning;
