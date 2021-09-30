import React, {Component} from "react";
import {Link} from "react-router-dom";

import "../styles/general/fontfaces.scss";
import "../styles/settings.scss";
import newElementIcon from "../../assets/icons/close.svg"; //todo: add actual icon
import WebsiteEntriesList from "./parts/website-entries-list";
import userDataService from "../../classes/UserDataService"

class Settings extends Component {

    constructor(props) {
        super(props);
        this.imgPath = null;
        this.state = {visibilityList: true};
    }

    render() {
        return (
            <div className="Settings">
                <header className="header">Settings
                    <div className="button" id="clearData" onClick={userDataService.clearData}>Clear Data</div>
                </header>
                <WebsiteEntriesList/>
                <Link to="/new-entry" className="button" id="newEntry">
                    <img src={newElementIcon} alt="plus icon for adding new entry"/>
                </Link>
            </div>
        )
    }
}

export default Settings;
