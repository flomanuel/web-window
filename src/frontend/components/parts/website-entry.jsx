import React, {Component} from "react";
import PropTypes from "prop-types";
import userDataService from "../../../classes/UserDataService"
import "../../styles/parts/website-entry.scss";
import {Link} from "react-router-dom";
import editIcon from "../../../assets/icons/edit.svg";
import deleteIcon from "../../../assets/icons/delete.svg";


class WebsiteEntry extends Component {

    /**
     *
     * @return {{entry}}
     */
    static get propTypes() {
        return {
            entry: PropTypes.object,
            updateSelectedEntries: PropTypes.func,
            isSelected: PropTypes.bool
        };
    }

    /**
     *
     * @return {JSX.Element}
     */
    render() {
        const entry = this.props?.entry;
        return (
            <tr key={entry.id ? entry.id : null}
                className="website-entries__element">
                <td className="element__data website-entries__element--align-left ">
                    <input className="element__checkbox website-entries__checkbox"
                           type="checkbox"
                           checked={this.props.isSelected}
                           onChange={() => {
                               this.props.updateSelectedEntries(entry.id);
                           }}
                    />
                    <div className="element__data--title">
                        {entry.title ? entry.title : 'Title'}
                    </div>
                    {entry.iconPath ?
                        <img alt={'Icon of ' + entry.title ? entry.title : 'Title'}
                             src={entry.iconPath}
                             className="element__data--icon"
                        />
                        : ''}
                    <div className="element__data--url">
                        {entry.url ? entry.url : ''}
                    </div>
                </td>
                <td className="element__buttons-wrapper website-entries__data--align-right">
                    {
                        entry.id ?
                            <Link to={`/edit-entry/${entry.id}`} className="button element__buttons--edit">
                                <img src={editIcon} alt="icon for editing entry"/>
                            </Link>
                            : null
                    }
                    <img className="button element__buttons--delete"
                         alt="icon for deleting the entry" src={deleteIcon}
                         onClick={async () => {
                             if (entry.id) {
                                 await userDataService.removeWebsiteEntry(entry.id);
                                 this.props.updateSelectedEntries(entry.id);
                                 this.forceUpdate();
                             } else {
                                 console.error("Couldn't delete entry because it has no id.");
                             }
                         }}
                    />
                </td>
            </tr>
        );
    }
}

export default WebsiteEntry;
