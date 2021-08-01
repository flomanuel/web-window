import React, {Component} from "react";
import "../styles/general/fontfaces.scss";
import "../styles/index.scss";
import WebsiteEntriesList from "./parts/website-entries-list";
import FormNewData from "./parts/form-new-data";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.imgPath = null;
        this.state = {visibilityForm: false, visibilityList: true, userData: null};
        this.getUserData();
    }

    getUserData() {
        window.electron.websiteEntries.then(result => {
            this.setState(({userData: result}))
        }).catch(e => {
            throw `Error loading user-defined list of websites: ${e}`
        })
    }

    render() {
        return (
            <div className="Settings">
                <header className="header">Settings
                    <div className="button" id="clearData" onClick={() => {
                        window.electron.clearWebsites().then(() => {
                            window.location.reload();
                        })
                    }}>Clear Data</div>
                </header>
                <WebsiteEntriesList userData={this.state.userData}/>
                <FormNewData/>
            </div>
        )
    }
}

export default Settings;
