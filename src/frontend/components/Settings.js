import React, {Component} from "react";
import "../styles/general/fontfaces.scss";
import "../styles/index.scss";
import toggleIcon from "../../assets/icons/toggle.svg";

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

    componentDidMount() {
        this.handleDefinedEvents()
    }

    handleDefinedEvents() {
        const wsFormNewEntryButton = document.getElementById('ww_button');
        wsFormNewEntryButton.addEventListener('click', () => {
            this.saveNewEntry();
        });

        const wsClearDataButton = document.getElementById('clearData');
        wsClearDataButton.addEventListener('click', () => {
            window.electron.clearWebsites().then(() => {
                window.location.reload();
            });
        });

        const wsFormNewEntryImg = document.getElementById('ww_img');
        wsFormNewEntryImg.addEventListener('dragenter', (e) => {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        wsFormNewEntryImg.addEventListener('dragover', (e) => {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        wsFormNewEntryImg.addEventListener('dragleave', (e) => {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        wsFormNewEntryImg.addEventListener('drop', (e) => {
            this.persistIconPath(e);
        }, false);
        wsFormNewEntryImg.addEventListener('dragdrop', (e) => {
            this.persistIconPath(e);
        }, false);
    }

    saveNewEntry() {
        const title = document.getElementById('ww_title').value;
        const url = document.getElementById('ww_url').value;
        window.electron.saveNewEntry(title ? title : 'Title', url ? url : 'https://www.google.de', this.imgPath).then((value) => {
            if (value) {
                window.location.reload(); // todo: change data handling to avoid reload (e.g. keep all data in render process, only communicate with main process over preload file to save the data held by the render process)
            } else {
                throw `Error saving new entry.`
            }
        })
    }

    /**
     *
     * @param e
     */
    persistIconPath(e) {
        e.stopPropagation();
        e.preventDefault();
        const dt = e.dataTransfer;
        const file = dt?.files[0];
        if (!file.type.startsWith('image/png')) {
            throw 'Error saving icon. Wrong format.'
        }
        this.imgPath = file.path;
    }

    render() {
        return (
            <div className="Settings">
                <header className="header">Settings
                    <div className="button" id="clearData">Daten löschen</div>
                </header>
                <main id="website-entries" className={
                    !this.state.visibilityList ? 'website-entries--hidden' : null
                }>
                    <div className="website-entries__toggle" onClick={() => {
                        this.setState(prevState => ({visibilityList: !prevState.visibilityList}));
                    }}>
                        <img src={toggleIcon}
                             alt="Click here to close the list of website entries."/>
                        <span>List of entries</span>
                    </div>
                    {
                        this.state.userData?.map(entry => (
                            <div key={entry.id ? entry.id : null} className="website-entries__element">
                                <h2 className="element__title">
                                    <span>{entry.title}</span>{entry.iconPath ?
                                    <img alt={'Icon of ' + entry.title} src={entry.iconPath}
                                         className="element__icon"/> : ''}
                                </h2>
                                <div className="element__url">{entry.url}</div>
                            </div>
                        ))
                    }
                </main>
                <form id="form-new-entry" className={
                    !this.state.visibilityForm ? 'form-new-entry--hidden' : null
                }>
                    <div className="form-new-entry__toggle" onClick={() => {
                        this.setState(prevState => ({visibilityForm: !prevState.visibilityForm}))
                    }}>
                        <img src={toggleIcon}
                             alt="Click here to close the form and create a new entry."/>
                        <span>Add new entry</span>
                    </div>
                    <div className="form-new-entry__elements">
                        <label htmlFor="ww_title">Title:</label>
                        <input type="text" id="ww_title" name="ww_title"/>
                        <label htmlFor="ww_url">URL:</label>
                        <input type="text" id="ww_url" name="ww_url"/>
                        <div id="ww_img">Drop png image here.</div>
                        <br/>
                        <button type="button" id="ww_button">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Settings;
