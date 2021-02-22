import React from "react";
import dropDownArrow from "../../../../../assets/icons/caret-down-tests.svg";

import dropDownArrowUp from "../../../../../assets/icons/caret-up-tests.svg";

export default function RestTestSnippets() {
  return (
    <div className="is-rest-invert show-hide-tests cards-dropdown minimize-card is-flex is-align-items-center is-justify-content-center">
      <span>Test Snippets</span>
      <span className="icon is-medium is-align-self-center show-hide-tests-icon">
        <img
          alt=""
          src={dropDownArrow}
          className="is-awesome-icon"
          aria-hidden="false"
        />
      </span>
    </div>
  );
}
