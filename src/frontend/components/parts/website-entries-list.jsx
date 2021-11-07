import React, {Component} from "react";
import WebsiteEntry from "./website-entry";
import UserDataService from "../../../classes/UserDataService";
import "../../styles/parts/website-entries-list.scss";
import exportIcon from "../../../assets/icons/export.png";
import deleteIcon from "../../../assets/icons/delete.svg";

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
            this.subscription = UserDataService.onDataChange().subscribe(userData => {
                this.setState({userData: userData})
            });
        }
        UserDataService.load();
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
        this.forceUpdate(); //todo: find better solution so we don't have to force an component update
    }

    exportSelectedEntries() { //todo: add info popup confirming export
        if (this.selectedEntries.length > 0) {
            const result = [];
            this.selectedEntries.forEach(eID => {
                this.state.userData?.websites.forEach(ws => {
                    if (ws.id === eID) {
                        result.push(ws);
                    }
                })
            })
            navigator.clipboard.writeText(JSON.stringify(result)).catch((e) => {
                throw `Copying content to clipboard failed with the following error: ${e}`;
            })
        }
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
                            <img className={this.selectedEntries.length <= 0
                                ? "website-entries__export-icon website-entries__export-icon--blocked"
                                : "website-entries__export-icon"}
                                 src={exportIcon}
                                 alt="icon for exporting the selected entries"
                                 onClick={this.exportSelectedEntries.bind(this)}
                            />
                            <img src={deleteIcon} alt="icon for deleting the selected entries"
                                 onClick={() => {
                                     this.selectedEntries.forEach(async eID => {
                                         await UserDataService.removeWebsiteEntry(eID);
                                         this.updateSelectedEntries(eID);
                                     });
                                 }}
                                 className={this.selectedEntries.length <= 0
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
