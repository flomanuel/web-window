import React, {Component} from "react";
import PropTypes from "prop-types";
import toggleIcon from "../../../assets/icons/toggle.svg";
import "../../styles/parts/website-entries-list.scss";
import WebsiteEntry from "./website-entry";

class WebsiteEntriesList extends Component {

    constructor(props) {
        super(props);
        this.state = {visibilityList: true};
    }

    static get propTypes() {
        return {
            userData: PropTypes.object,
        };
    }

    render() {
        return (
            <main id="website-entries" className={
                !this.state.visibilityList ? 'website-entries--hidden' : null
            }>
                <div className="website-entries__toggle" onClick={() => {
                    this.setState((prevState) => ({visibilityList: !prevState.visibilityList}));
                }}>
                    <img src={toggleIcon}
                         alt="Click here to close the list of website entries."/>
                    <span>List of entries</span>
                </div>
                {
                    this.props.userData?.map((entry) => (
                        <WebsiteEntry key={entry.id ? entry.id : ''} entry={entry}/>
                    ))
                }
            </main>
        );
    }
}

export default WebsiteEntriesList;
