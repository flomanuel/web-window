import * as React from "react";
import {Component, ReactNode} from "react";
import "../../styles/general/fontfaces.scss";
import "../../styles/index.scss";
import WebsiteEntriesList from "./parts/website-entries-list";
import FormNewData from "./parts/form-new-data";

export default class Settings extends Component<any, { userData: any }> {

    /**
     *
     * @param props
     */
    constructor(props: any) {
        super(props);
        this.state = {userData: null};
        this.getUserData();
    }

    componentDidMount() {
        this.handleDefinedEvents()
    }

    /**
     *
     * @private
     */
    private getUserData() {
        // @ts-ignore
        window.electron.websiteEntries.then((result: any) => {
            this.setState(({userData: result}))
        }).catch((e: any) => {
            throw `Error loading user-defined list of websites: ${e}`
        })
    }

    /**
     *
     * @private
     */
    private handleDefinedEvents() {
        const wsClearDataButton = document.getElementById('clearData');
        wsClearDataButton.addEventListener('click', () => {
            // @ts-ignore
            window.electron.clearWebsites().then(() => {
                window.location.reload();
            });
        });
    }

    render(): ReactNode {
        return (
            <div className="Settings">
                <header className="header">Settings
                    <div className="button" id="clearData">Clear Data</div>
                </header>
                <WebsiteEntriesList userData={this.state.userData}/>
                <FormNewData/>
            </div>
        )
    }
}