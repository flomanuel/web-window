import React, {Component} from "react";
import "../styles/general/fontfaces.scss";
import "../styles/settings.scss";
import WebsiteEntriesList from "./parts/website-entries-list";
import FormNewEntry from "./parts/form-new-entry";
import userDataService from "../../classes/UserDataService"

class Settings extends Component {

    constructor(props) {
        super(props);
        this.subscription = null;
        this.imgPath = null;
        this.state = {visibilityForm: false, visibilityList: true, userData: null};
    }

    componentDidMount() {
        if (!this.subscription) {
            this.subscription = userDataService.onDataChange().subscribe(userData => {
                this.setState(({userData: userData}))
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
            <div className="Settings">
                <header className="header">Settings
                    <div className="button" id="clearData" onClick={userDataService.clearData}>Clear Data</div>
                </header>
                <WebsiteEntriesList userData={this.state.userData}/>
                <FormNewEntry/>
            </div>
        )
    }
}

export default Settings;
