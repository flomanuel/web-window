import React, {Component} from "react";
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
                        <th>toggle</th>
                        <th>entries</th>
                        <th>export, delete</th>
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
