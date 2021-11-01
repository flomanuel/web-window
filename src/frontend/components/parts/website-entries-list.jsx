import React, {Component} from "react";
import exportIcon from "../../../assets/icons/export.png";
import deleteIcon from "../../../assets/icons/delete.svg";
import "../../styles/parts/website-entries-list.scss";
import WebsiteEntry from "./website-entry";
import userDataService from "../../../classes/UserDataService";

class WebsiteEntriesList extends Component {

    constructor(props) {
        super(props);
        this.subscription = null;
        this.state = {userData: null};
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

    render() {
        return (
            <main id="website-entries">
                <table>
                    <thead>
                    <tr>
                        <th className="website-entries__data--align-left">
                            <input className="website-entries__checkbox" type="checkbox"/>
                            <span>Entries</span>
                        </th>
                        <th className="website-entries__data--align-right">
                            <img className="website-entries__export-icon" src={exportIcon}
                                 alt="icon for exporting the selected entries"/>
                            <img onClick={userDataService.clearData} className="website-entries__delete-icon"
                                 src={deleteIcon} alt="icon for deleting the selected entries"/>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.userData?.websites?.map(entry => (
                            <WebsiteEntry key={entry.id ? entry.id : ''} entry={entry}/>
                        ))
                    }
                    </tbody>
                </table>
            </main>
        );
    }
}

export default WebsiteEntriesList;
