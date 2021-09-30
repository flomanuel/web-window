import React, {Component} from "react";
import "../styles/general/fontfaces.scss";
import "../styles/newEntry.scss";
import FormNewEntry from "./parts/form-new-entry";
import {Link} from "react-router-dom";
import moveBackIcon from "../../assets/icons/toggle.svg";

class NewEntry extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<>
            <header className="header">
                <Link to="/" className="button" id="moveBack">
                    <img src={moveBackIcon} alt="icon for moving back to main menu"/>
                </Link>
                New Entry
            </header>
            <FormNewEntry/>
        </>)
    }
}

export default NewEntry;
