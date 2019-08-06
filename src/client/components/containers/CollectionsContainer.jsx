import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import collectionsController from '../../controllers/collectionsController'

const mapStateToProps = store => ({
  collections: store.business.collections,
});

const mapDispatchToProps = dispatch => ({
  
});

class CollectionsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let meep = this.props.collections
    console.log("meep",meep)

    return (
      <div className={'collections-container'}>
        <p>Yooo</p>
        <p>{JSON.stringify(meep)}</p>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CollectionsContainer);
