import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import CookieTableCell from './CookieTableCell.jsx'


const mapStateToProps = store => ({
});

const mapDispatchToProps = dispatch => ({

});

class CookieTableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    }

    render() {

        let tableCellArray = [];

        for(const key in this.props.cookie) {
            tableCellArray.push(<CookieTableCell detail={this.props.cookie[key]} key={key}></CookieTableCell>)
        }
        if (!this.props.cookie.expirationDate) {
            tableCellArray.push(<CookieTableCell detail={''} key='expirationDate'></CookieTableCell>)
        }

        return (
          <div className='cookieTableRow nested-grid-9'>
              {tableCellArray}
          </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CookieTableRow);