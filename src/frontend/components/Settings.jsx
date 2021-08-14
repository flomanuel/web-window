import React, {Component} from "react";
import "../styles/general/fontfaces.scss";
import "../styles/index.scss";
import WebsiteEntriesList from "./parts/website-entries-list";
import FormNewData from "./parts/form-new-data";
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
            this.subscription = userDataService.onDataChange.subscribe(userData => {
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
                    <div className="button" id="clearData" onClick={() => {
                        userDataService.clearData();
                    }}>Clear Data</div>
                </header>
                <WebsiteEntriesList userData={this.state.userData}/>
                <FormNewData/>
            </div>
        )
    }
}

export default Settings;
