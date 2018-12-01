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
            openTab: '',
            tabContentShown: [],
        }
        this.handleTabSelect = this.handleTabSelect.bind(this);
    }

    handleTabSelect(val) {
        switch (val) {
            case 'Body':
                this.setState({ 
                    openTab: val, 
                    });
                break;
            case 'Cookies':
                this.setState({ 
                    openTab: val, 
                    });
                break;
            case 'Headers':
                this.setState({ 
                    openTab: val, 
                    });
                break;
            default:
                console.log(`There was an error with ${val}`);
        }
    }

    componentDidMount() {
        console.log('requestContent', this.props.requestContent);
        this.handleTabSelect('Headers')
    }

    componentDidUpdate() {
        if (this.state.tabContentShown[0]) {
            console.log(this.state.tabContentShown[0].key);
            console.log(this.state.tabContentShown[0].value);
        }
    }

    render() {
        let body = 'Body';
        // let cookies = 'Cookies';
        let headers = 'Headers';
        let tabContentShown;

        if (this.state.openTab === 'Body') {
            tabContentShown = this.props.requestContent.body;
        }

        if (this.state.openTab === 'Headers' && this.props.requestContent.headers.length > 0) {
            tabContentShown = [];
            this.props.requestContent.headers.forEach((cur, idx) => {
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
                    {/* <Tab onTabSelected={this.handleTabSelect} tabName={cookies} /> */}
                </ul>
                <div className={'tab_content'}>
                    {tabContentShown}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestTabs);