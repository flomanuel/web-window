import React, {Component} from "react";
import userDataService from "../../../classes/UserDataService"
import "../../styles/parts/form-new-entry.scss";

class FormNewEntry extends Component {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {title: '', url: '', imgPath: ''};
    }

    /**
     *
     * @param e
     */
    preventDefaultPropagation(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    /**
     *
     * @param event
     */
    saveNewEntry(event) {
        event.preventDefault();
        userDataService.saveNewWebsiteEntry(this.state.title, this.state.url, this.state.imgPath).then(result => {
            if (result) {
                this.resetEntries();
            }
        });
    }

    resetEntries() {
        this.setState({title: '', url: '', imgPath: ''})
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

    /**
     *
     * @param target
     */
    handleChange({target}) {
        this.setState({[target.name]: target.value});
    }

    /**
     *
     * @return {JSX.Element}
     */
    previewIcon() {
        let html = <span className="ww-img__placeholder">Drop png image here...</span>;
        if (this.state.imgPath !== '') {
            html = <img className="ww-img__element" src={this.state.imgPath}
                        alt="Preview of the uploaded png-icon for the new website entry"/>
        }
        return html
    }

    /**
     *
     * @return {JSX.Element}
     */
    render() {
        return (
            <form className="form-new-entry" onSubmit={this.saveNewEntry.bind(this)}>
                <div className="form-new-entry__elements">
                    <div className="form-new-entry__element form-new-entry__element--title">
                        <input type="text"
                               id="ww_title"
                               name="title"
                               value={this.state.title}
                               onChange={this.handleChange.bind(this)}
                        />
                        <label htmlFor="ww_title">Title...</label>
                    </div>
                    <div className="form-new-entry__element">
                        <input type="text"
                               id="ww_url"
                               name="url"
                               value={this.state.url}
                               onChange={this.handleChange.bind(this)}
                        />
                        <label htmlFor="ww_url">URL...</label>
                    </div>
                    <div className="form-new-entry__element">
                        <div className="ww-img"
                             onDragEnter={e => this.preventDefaultPropagation(e)}
                             onDragOver={e => this.preventDefaultPropagation(e)}
                             onDragLeave={e => this.preventDefaultPropagation(e)}
                             onDrop={e => this.persistIconPath(e)}>
                            {this.previewIcon()}
                        </div>
                    </div>
                    <input type="submit" className="ww-button"/>
                </div>
            </form>
        );
    }
}

export default FormNewEntry;
