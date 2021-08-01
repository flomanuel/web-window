import {Component} from "react";
import toggleIcon from "../../../../assets/icons/toggle.svg";
import WebsiteEntry from "./website-entry";
import * as React from "react";

export default class WebsiteEntriesList extends Component<any, { visibilityList: boolean }> {

    constructor(props: any) {
        super(props);
        this.state = {visibilityList: true};
    }

    render() {
        return (
            <main id="website-entries" className={
                !this.state.visibilityList ? 'website-entries--hidden' : null
            }>
                <div className="website-entries__toggle" onClick={() => {
                    this.setState((prevState: any) => ({visibilityList: !prevState.visibilityList}));
                }}>
                    <img src={toggleIcon}
                         alt="Click here to close the list of website entries."/>
                    <span>List of entries</span>
                </div>
                {
                    this.props.userData?.map((entry: any) => (
                        <WebsiteEntry entry={entry}/>
                    ))
                }
            </main>
        );
    }
}
