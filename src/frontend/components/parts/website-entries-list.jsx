import React, {Component} from "react";
import toggleIcon from "../../../assets/icons/toggle.svg";
import "../../styles/parts/website-entries-list.scss";
import WebsiteEntry from "./website-entry";
import userDataService from "../../../classes/UserDataService";

class WebsiteEntriesList extends Component {

    constructor(props) {
        super(props);
        this.subscription = null;
        this.state = {visibilityList: true, userData: null};
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
                    this.state.userData?.websites?.map(entry => (
                        <WebsiteEntry key={entry.id ? entry.id : ''} entry={entry}/>
                    ))
                }
            </main>
        );
    }
}

export default WebsiteEntriesList;
