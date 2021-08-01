import React, {Component} from "react";
import PropTypes from "prop-types";

class WebsiteEntry extends Component {

    static get propTypes() {
        return {
            entry: PropTypes.object,
        };
    }

    render() {
        const entry = this.props?.entry;
        return (
            <div key={entry.id ? entry.id : null} className="website-entries__element">
                <h2 className="element__title">
                    <span className="element__title--text">{entry.title ? entry.title : 'Title'}</span>{entry.iconPath ?
                    <img alt={'Icon of ' + entry.title ? entry.title : 'Title'} src={entry.iconPath}
                         className="element__icon"/> : ''}
                </h2>
                <div className="element__url">{entry.url ? entry.url : ''}</div>
            </div>
        );
    }
}

export default WebsiteEntry;
