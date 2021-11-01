import React, {Component} from "react";
import PropTypes from "prop-types";
import userDataService from "../../../classes/UserDataService"
import "../../styles/parts/website-entry.scss";
import {Link} from "react-router-dom";
import editIcon from "../../../assets/icons/edit.svg";

class WebsiteEntry extends Component {

    /**
     *
     * @return {{entry}}
     */
    static get propTypes() {
        return {
            entry: PropTypes.object,
        };
    }

    /**
     *
     * @return {JSX.Element}
     */
    render() {
        const entry = this.props?.entry;
        return (
            <tr key={entry.id ? entry.id : null} className="website-entries__element website-entries__row website-entries__row--underline">
                <td>toggle</td>
                <td className="element__title">
                    <span className="element__title--text">{entry.title ? entry.title : 'Title'}</span>{entry.iconPath ?
                    <img alt={'Icon of ' + entry.title ? entry.title : 'Title'} src={entry.iconPath}
                         className="element__icon"/> : ''}
                    <div className="element__url">{entry.url ? entry.url : ''}</div>
                </td>
                <td>
                    <Link to="/" className="button element__edit">
                        <img src={editIcon} alt="icon for editing entry"/>
                    </Link>
                    <div className="button element__delete" onClick={() => {
                        if (entry.id) {
                            userDataService.removeWebsiteEntry(entry.id);
                        } else {
                            console.error("Couldn't delete entry because it has no id.");
                        }
                    }}>Delete Entry
                    </div>
                </td>
            </tr>
        );
    }
}

export default WebsiteEntry;
