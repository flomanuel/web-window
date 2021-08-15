import React, {Component} from "react";
import toggleIcon from "../../../assets/icons/toggle.svg";
import userDataService from "../../../classes/UserDataService"
import "../../styles/parts/form-new-entry.scss";

class FormNewEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {visibilityForm: false, title: '', url: '', imgPath: ''};
    }

    preventDefaultPropagation(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    saveNewEntry() {
        userDataService.saveNewWebsiteEntry(this.state.title, this.state.url, this.state.imgPath);
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
                this.setState({imgPath: file.path});
            }
        }
    }

    handleChange({target}) {
        this.setState({[target.name]: target.value});
    }

    previewIcon() {
        let html = 'Drop png image here.';
        if (this.state.imgPath !== '') {
            html = <img src={this.state.imgPath} alt="Preview of the uploaded png-icon for the new website entry"/>
        }
        return html
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
                    <input type="text"
                           id="ww_title"
                           name="title"
                           value={this.state.title}
                           onChange={e => this.handleChange(e)}
                    />
                    <label htmlFor="ww_url">URL:</label>
                    <input type="text"
                           id="ww_url"
                           name="url"
                           value={this.state.url}
                           onChange={e => this.handleChange(e)}
                    />
                    <div className="ww-img"
                         onDragEnter={e => this.preventDefaultPropagation(e)}
                         onDragOver={e => this.preventDefaultPropagation(e)}
                         onDragLeave={e => this.preventDefaultPropagation(e)}
                         onDrop={e => this.persistIconPath(e)}
                    >
                        {this.previewIcon()}
                    </div>
                    <br/>
                    <button type="button"
                            className="ww-button"
                            onClick={() => this.saveNewEntry()}>Save
                    </button>
                </div>
            </form>
        );
    }
}

export default FormNewEntry;
