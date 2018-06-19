import upperFirst from 'lodash/upperFirst';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { findDOMNode } from 'react-dom';

import { scrollTo } from 'utils/domUtils';

class DateHeader extends Component {
  static propTypes = {
    beforeText: PropTypes.string,
    date: PropTypes.string.isRequired,
    onDecreaseDateButtonClick: PropTypes.func,
    onIncreaseDateButtonClick: PropTypes.func,
    scrollTo: PropTypes.bool,
  };

  componentDidMount() {
    if (this.props.scrollTo) {
      // Use timeout to allow rest of the page render and the scrollTo to work properly.
      setTimeout(() => {
        scrollTo(findDOMNode(this));
      }, 100);
    }
  }

  render() {
    const { beforeText, date, onDecreaseDateButtonClick, onIncreaseDateButtonClick } = this.props;
    const dateString = moment(date).format('dddd, LL');

    return (
      <h3 className="date-header" id="date-header">
        {onDecreaseDateButtonClick && (
          <button
            className="date-header-button decrease-date-button"
            onClick={onDecreaseDateButtonClick}
          >
            <Glyphicon glyph="chevron-left" />
          </button>
        )}
        {onIncreaseDateButtonClick && (
          <button
            className="date-header-button increase-date-button"
            onClick={onIncreaseDateButtonClick}
          >
            <Glyphicon glyph="chevron-right" />
          </button>
        )}
        {beforeText && `${beforeText} ${dateString}`}
        {!beforeText && upperFirst(dateString)}
      </h3>
    );
  }
}


export default DateHeader;
