/* eslint-disable react/jsx-no-duplicate-props */
import React, { Component } from 'react';
import Header from './Header.jsx';

class HeaderEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: [],
      count: 1,
    };
    this.onChangeUpdateHeader = this.onChangeUpdateHeader.bind(this);
  }

  componentDidMount() {
    this.addHeader();
  }

  componentDidUpdate() {
    this.updateContentType();
  }

  updateContentType() {
    let contentType;
    if (this.props.bodyType === 'none') {
      contentType = '';
    }
    else if (this.props.bodyType === 'x-www-form-urlencoded') {
      contentType = 'x-www-form-urlencoded';
    }
    else {
      contentType = this.props.rawType;
    }

    // Attempt to update header in these conditions:
    // if there is no existing content type header
    // if there is a existing content type header AND if the value does not match
    const foundHeader = this.state.headers.find(header => header.key.toLowerCase() === 'content-type');

    if (!foundHeader || (foundHeader && foundHeader.value !== contentType)) {
      this.updateContentTypeHeader(contentType, foundHeader);
    }
  }

  updateContentTypeHeader(contentType, foundHeader) {
    // if user has selected a bodyType or rawType in body...
    if (contentType !== '') {
      // if found, remove it, and readd.
      if (foundHeader) {
        const filtered = this.state.headers.filter(header => header.key !== 'content-type');

        this.setState(
          {
            headers: filtered,
          },
          () => {
            const headersDeepCopy = JSON.parse(JSON.stringify(this.state.headers));

            headersDeepCopy.unshift({
              id: this.state.count,
              active: true,
              key: 'content-type',
              value: contentType,
            });

            this.setState(
              {
                headers: headersDeepCopy,
                count: this.state.count + 1,
              },
              () => {
                this.props.updateHeaders(this.state.headers);
              },
            );
          },
        );
      }
      else {
        // create new header
        const headersDeepCopy = JSON.parse(JSON.stringify(this.state.headers));

        headersDeepCopy.unshift({
          id: this.state.count,
          active: true,
          key: 'content-type',
          value: contentType,
        });

        this.setState(
          {
            headers: headersDeepCopy,
            count: this.state.count + 1,
          },
          () => {
            this.props.updateHeaders(this.state.headers);
          },
        );
      }
    }
    // remove content-type header
    else if (this.state.headers.find(header => header.key === 'content-type')) {
      this.setState(
        {
          headers: JSON.parse(JSON.stringify(this.state.headers)).filter(
            header => header.key !== 'content-type',
          ),
        },
        () => {
          this.props.updateHeaders(this.state.headers);
        },
      );
    }
  }

  addHeader(cb) {
    const headersDeepCopy = JSON.parse(JSON.stringify(this.state.headers));

    headersDeepCopy.push({
      id: this.state.count,
      active: false,
      key: '',
      value: '',
    });

    this.setState(
      {
        headers: headersDeepCopy,
        count: this.state.count + 1,
      },
      () => {
        if (cb) {
          cb();
        }
      },
    );
  }

  onChangeUpdateHeader(id, field, value) {
    const headersDeepCopy = JSON.parse(JSON.stringify(this.state.headers));

    let indexToBeUpdated;
    for (let i = 0; i < headersDeepCopy.length; i += 1) {
      if (headersDeepCopy[i].id === id) {
        indexToBeUpdated = i;
        break;
      }
    }

    headersDeepCopy[indexToBeUpdated][field] = value;

    // also switch checkbox if they are typing
    if (field === 'key' || field === 'value') {
      headersDeepCopy[indexToBeUpdated].active = true;
    }

    this.setState(
      {
        headers: headersDeepCopy,
      },
      () => {
        const emptyHeadersCount = this.state.headers
          .map(header => (!header.key && !header.value ? 1 : 0))
          .reduce((acc, cur) => acc + cur);

        if (emptyHeadersCount === 0) {
          this.addHeader();
        }
        else {
          this.props.updateHeaders(this.state.headers);
        }
      },
    );
  }

  render() {
    const headersArr = this.state.headers.map((header, index) => (
      <Header
        content={header}
        changeHandler={this.onChangeUpdateHeader}
        key={index}
        Key={header.key}
        value={header.value}
      />
    ));
    return <div style={this.props.stylesObj}>{headersArr}</div>;
  }
}

export default HeaderEntryForm;
