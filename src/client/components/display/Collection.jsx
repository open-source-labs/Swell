import React, { Component } from 'react';
import collectionsController from '../../controllers/collectionsController';

class Collection extends Component {
  constructor(props) {
    super(props);
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
    console.log(this.props.content);
    return (
      <div>

        <div className="is-flex is-justify-content-space-between m-5">
          <div 
            className="is-clickable is-primary-link is-align-items-center is-flex"
            onClick={(this.addCollectionToReqResContainer)}
          >
            {this.props.content.name}
          </div>
          <div className="is-flex is-justify-content-space-between is-align-items-center">
            <div className="is-clickable is-primary-link m-3" onClick={() => collectionsController.exportCollection(this.props.content.id)}>
              Export
            </div>
            <div className="is-clickable flex-grow-1 delete m-3" onClick={this.deleteCollection} id={this.props.content.id}>
            </div>
          </div>
        </div>

        <hr/>        
      </div>
    )
  }
}

export default Collection;