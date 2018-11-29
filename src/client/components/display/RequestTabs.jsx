import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

import Tab from './Tab.jsx';

const mapStateToProps = store => ({
    store: store,
  });
  
  const mapDispatchToProps = dispatch => ({
  
  });

class RequestTabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openTabs: '',
            tabContentShown: [],
        }
        this.handleTabSelect = this.handleTabSelect.bind(this);
    }

    handleTabSelect(val) {
        console.log('val is', val, this.state)
        console.log('propsthing', this.props.store.business.reqResArray[0].request.headers)

        switch (val) {
            case 'Body' :
                this.setState({ openTabs: val, tabContentShown : this.props.store.business.reqResArray[0].request.body});
                break;
            case 'Cookies' :
                this.setState({ openTabs: val, tabContentShown : this.props.store.business.reqResArray[0].request.cookies});
                break;
            case 'Headers' :
                this.setState({ openTabs: val, tabContentShown : this.props.store.business.reqResArray[0].request.headers});
                break;
            default:
                console.log(`There was an error with ${val}`);
        }
    }

    componentDidMount() {
        this.handleTabSelect('Headers')
    }

    componentDidUpdate() { 
        console.log(this.props.store);
        if (this.state.tabContentShown[0]) {
            console.log(this.state.tabContentShown[0].key);
            console.log(this.state.tabContentShown[0].value);
        }
    }

    render() {
        let body = 'Body';
        let cookies = 'Cookies';
        let headers = 'Headers';
        let tabContentShown = [];

        if (this.state.tabContentShown.length > 0) {
            console.log('this', this.state.tabContentShown)

            this.state.tabContentShown.forEach( (cur, idx) => {
                console.log('cur', cur)
                tabContentShown.push(
                    <div className={'nested-grid-2'}>
                        <span className={'tertiary-title title_offset'}>{cur.key}</span>
                        <span className={'tertiary-title title_offset'}>{cur.value}</span>
                    </div>
                )
            })
        }

        return (
            <div>
                <ul className={'tab_list'}>
                    <Tab onTabSelected={this.handleTabSelect} tabName={headers} />
                    <Tab onTabSelected={this.handleTabSelect} tabName={body} />
                    <Tab onTabSelected={this.handleTabSelect} tabName={cookies} />
                </ul>
                <div className={'tab_content'}>
                   {tabContentShown}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestTabs);