import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';


const mapStateToProps = store => ({
});

const mapDispatchToProps = dispatch => ({

});

class CookieTableCell extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    }

    render() {

        return (
          <div className='cookieTableCell'>
            {this.props.detail}
          </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CookieTableCell);