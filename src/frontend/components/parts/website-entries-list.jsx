import React, {Component} from "react";
import exportIcon from "../../../assets/icons/export.png";
import deleteIcon from "../../../assets/icons/delete.svg";
import "../../styles/parts/website-entries-list.scss";
import WebsiteEntry from "./website-entry";
import userDataService from "../../../classes/UserDataService";
import UserDataService from "../../../classes/UserDataService";

class WebsiteEntriesList extends Component {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.subscription = null;
        this.state = {userData: null};
        this.selectedEntries = [];
    }

    componentDidMount() {
        if (!this.subscription) {
            this.subscription = userDataService.onDataChange().subscribe(userData => {
                this.setState({userData: userData})
            });
        }
        userDataService.load();
    }

    componentWillUnmount() {
        this.subscription.unsubscribe;
        this.subscription = null;
    }

    /**
     *
     * @return {boolean}
     */
    areAllEntriesChecked() {
        return this.selectedEntries.length > 0 && this.selectedEntries.length === this.state.userData?.websites.length;
    }

    /**
     *
     * @param eID
     */
    updateSelectedEntries(eID) {
        if (this.selectedEntries.includes(eID)) {
            this.selectedEntries = this.selectedEntries.filter(el => el !== eID);
        } else {
            this.selectedEntries.push(eID);
        }
        this.forceUpdate(); //todo: Find better solution so we don't have to force an component update.
    }

    /**
     *
     * @return {JSX.Element}
     */
    render() {
        const websites = this.state.userData?.websites;
        return (
            <main id="website-entries">
                <table>
                    <thead>
                    <tr>
                        <th className="website-entries__data--align-left">
                            <input className="website-entries__checkbox"
                                   type="checkbox"
                                   checked={this.areAllEntriesChecked()}
                                   onChange={() => {
                                       if (websites?.length === this.selectedEntries.length) {
                                           this.selectedEntries = [];
                                       } else {
                                           this.selectedEntries = websites?.map(ws => ws.id);
                                       }
                                       this.forceUpdate();
                                   }}
                            />
                            <span>Entries</span>
                        </th>
                        <th className="website-entries__data--align-right">
                            <img className={websites?.length <= 0
                                ? "website-entries__export-icon website-entries__export-icon--blocked"
                                : "website-entries__export-icon"}
                                 src={exportIcon}
                                 alt="icon for exporting the selected entries"
                            />
                            <img src={deleteIcon} alt="icon for deleting the selected entries"
                                 onClick={() => {
                                     this.selectedEntries.forEach(async eID => {
                                         await UserDataService.removeWebsiteEntry(eID);
                                         this.updateSelectedEntries(eID);
                                     });
                                     this.forceUpdate();
                                 }}
                                 className={websites?.length <= 0
                                     ? "website-entries__delete-icon website-entries__delete-icon--blocked"
                                     : "website-entries__delete-icon"}
                            />
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        websites?.map(entry => {
                            let isSelected = this.selectedEntries.includes(entry.id);
                            return (
                                <WebsiteEntry updateSelectedEntries={this.updateSelectedEntries.bind(this)}
                                              isSelected={isSelected}
                                              key={entry.id ? entry.id : ''} entry={entry}
                                />
                            );
                        })
                    }
                    </tbody>
                </table>
            </main>
        );
    }
}

export default WebsiteEntriesList;
