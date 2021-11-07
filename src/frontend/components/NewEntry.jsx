import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

import FormNewEntry from "./parts/form-new-entry";
import "../styles/general/fontfaces.scss";
import "../styles/newEntry.scss";
import moveBackIcon from "../../assets/icons/toggle.svg";


class NewEntry extends Component {

    constructor(props) {
        super(props);
    }


    /**
     *
     * @return {{match}}
     */
    static get propTypes() {
        return {
            match: PropTypes.object,
            history: PropTypes.object
        };
    }

    render() {
        return (<>
            <header className="header">
                <Link to="/" className="button" id="moveBack">
                    <img src={moveBackIcon} alt="icon for moving back to main menu"/>
                </Link>
                New Entry
            </header>
            <FormNewEntry history={this.props.history} entryId={this.props.match.params?.id ? this.props.match.params?.id : null}/>
        </>)
    }
}

export default NewEntry;
