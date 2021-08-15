import React, {Component} from "react";
import toggleIcon from "../../../assets/icons/toggle.svg";
import userDataService from "../../../classes/UserDataService"
import "../../styles/parts/form-new-entry.scss";

class FormNewEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {visibilityForm: false};
        this.imgPath = '';
    }

    preventDefaultPropagation(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    saveNewEntry() {
        // @ts-ignore
        const title = document.getElementById('ww_title').value;
        // @ts-ignore
        const url = document.getElementById('ww_url').value;
        userDataService.saveNewEntry(title, url, this.imgPath);
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
        if (file) {
            if (!file.type.startsWith('image/png')) {
                throw 'Error saving icon. Wrong format.'
            } else {
                this.imgPath = file.path;
            }
        }
    }

    render() {
        return (
            <form className={
                !this.state.visibilityForm ? 'form-new-entry form-new-entry--hidden' : 'form-new-entry'
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
                    <div className="ww-img"
                         onDragEnter={e => this.preventDefaultPropagation(e)}
                         onDragOver={e => this.preventDefaultPropagation(e)}
                         onDragLeave={e => this.preventDefaultPropagation(e)}
                         onDrop={e => this.persistIconPath(e)}
                    >Drop png image here.
                    </div>
                    <br/>
                    <button type="button" className="ww-button" onClick={() => this.saveNewEntry()}>Save</button>
                </div>
            </form>
        );
    }
}

export default FormNewEntry;