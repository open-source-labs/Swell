import React, { Component } from 'react';
import collectionsController from '../../controllers/collectionsController';

class Collection extends Component {
  constructor(props) {
    super(props);
    // this.state = {};
    this.deleteCollection = this.deleteCollection.bind(this);
    this.addCollectionToReqResContainer = this.addCollectionToReqResContainer.bind(this);
  }

  addCollectionToReqResContainer() {
    this.props.collectionToReqRes(this.props.content.reqResArray)
  }

  deleteCollection(e) {
    this.props.deleteFromCollection(this.props.content); //a function we need to make in the container
    collectionsController.deleteCollectionFromIndexedDb(e.target.id);
  }

  render() {
    return (
      <div className="collection-container">
        <div className="collection-text-container" onClick={this.addCollectionToReqResContainer}>
          <div className="collection-name"> {this.props.content.name}</div>
        </div>
        
        <div className='collection-delete-container'>
          <div className="collection-export-button" onClick={() => collectionsController.exportCollection(this.props.content.id)}>
            Export&nbsp;
          </div>
          <div className="collection-delete-button" onClick={this.deleteCollection} id={this.props.content.id}>
            |&nbsp;&nbsp;X
          </div>
        </div>
      </div>
    )
  }
}

export default Collection;