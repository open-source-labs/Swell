import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

import Tab from './Tab.jsx';
import SSERow from './SSERow.jsx';


const mapStateToProps = store => ({
    store: store,
});

const mapDispatchToProps = dispatch => ({

});

class ResponseTabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openTabs: '',
            tabContentShown: [],
        }
        this.handleTabSelect = this.handleTabSelect.bind(this);
    }

    handleTabSelect(val) {
        console.log('HIT', val)
        switch (val) {
            case 'Cookies':
                this.setState({ openTabs: val, tabContentShown: this.props.store.business.reqResArray[0].response.cookies });
                break;
            case 'Headers':
                this.setState({ openTabs: val, tabContentShown: this.props.store.business.reqResArray[0].response.headers });
                break;
            case 'Events':
                this.setState({ openTabs: val, tabContentShown: this.props.store.business.reqResArray[0].response.events });
                break;
            default:
                console.log(`There was an error with ${val}`);
        }
    }

    componentDidMount() {
        console.log('FIRED!!!!!')
        this.handleTabSelect('Events');
    }

    render() {
        let events = 'Events';
        let cookies = 'Cookies';
        let headers = 'Headers';
        let tabContentShown;
        let tabContentShownEvents = [];

        if (this.state.openTabs === 'Events') {
            console.log('>>>>>> Events')
            if (this.state.tabContentShown) {
                tabContentShown = this.state.tabContentShown;
                tabContentShown.forEach((cur, idx) => {
                    tabContentShownEvents.push(
                        <SSERow key={idx} content={cur}></SSERow>
                    )
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>tabContentShownEvents', tabContentShownEvents)
                })
            }
        }

        if (this.state.openTabs === 'Headers') {
            console.log('>>>>>> HEADERS')
            let headerObj = this.state.tabContentShown;

            if (!Array.isArray(headerObj) && headerObj) {
                for (let key in headerObj) {
                    console.log('key', key, headerObj[key]);
                    tabContentShownEvents.push(
                        <div className={'nested-grid-2'}>
                            <span className={'tertiary-title title_offset'}>{key}</span>
                            <span className={'tertiary-title title_offset'}>{headerObj[key]}</span>
                        </div>
                    )
                }
            }
        }

        return (
            <div>
                <ul className={'tab_list'}>
                    <Tab onTabSelected={this.handleTabSelect} tabName={events} />
                    <Tab onTabSelected={this.handleTabSelect} tabName={cookies} />
                    <Tab onTabSelected={this.handleTabSelect} tabName={headers} />
                </ul>
                <div className={'tab_content'}>
                    {tabContentShownEvents}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResponseTabs);