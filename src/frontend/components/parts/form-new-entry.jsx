import React, {Component} from "react";
import PropTypes from "prop-types";

import userDataService from "../../../classes/UserDataService"
import HashGeneratorFrontend from "../../../classes/HashGeneratorFrontend";
import "../../styles/parts/form-new-entry.scss";
import iconAdd from "../../../assets/icons/add.svg"
import deleteIcon from "../../../assets/icons/delete.svg";


class FormNewEntry extends Component {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.defaultWebsiteDataStructure = {title: '', url: '', imgPath: '', externalUrls: [], openAtStartup: true};
        this.state = this.defaultWebsiteDataStructure;
    }

    /**
     *
     * @return {{match}}
     */
    static get propTypes() {
        return {
            entryId: PropTypes.string,
            history: PropTypes.object
        };
    }

    componentDidMount() {
        if (this.props.entryId !== null) {
            this.setWebsiteEntry();
        }
    }

    resetEntries() {
        this.setState(this.defaultWebsiteDataStructure);
    }

    /**
     *
     * @return {Promise<void>}
     */
    async setWebsiteEntry() {
        let dataStructure = this.defaultWebsiteDataStructure;
        if (this.props.entryId !== null) {
            const dbEntry = await userDataService.getSingleWebsiteEntry(this.props.entryId);
            if (dbEntry !== false) {
                dataStructure.title = dbEntry.title;
                dataStructure.url = dbEntry.url;
                dataStructure.imgPath = dbEntry.iconPath;
                dataStructure.externalUrls = dbEntry.externalUrls;
                dataStructure.openAtStartup = dbEntry.openAtStartup;
                this.setState(dataStructure);
            } else {
                throw `Error loading website entry from database. No entry with id ${this.props.entryId} existing.`;
            }
        } else {
            this.setState(dataStructure);
        }
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
        if (this.props.entryId !== null) {
            userDataService.updateWebsiteEntry(
                this.state.title, this.state.url, this.state.imgPath, this.state.externalUrls, this.props.entryId, this.state.openAtStartup
            ).then(result => {
                if (result) {
                    this.props.history.push('/');
                }
            })
        } else {
            userDataService.saveNewWebsiteEntry(this.state.title, this.state.url, this.state.imgPath, this.state.externalUrls, this.state.openAtStartup).then(result => {
                if (result) {
                    this.resetEntries();
                }
            });
        }
    }

    /**
     *
     * @param e
     */
    persistIconPath(e) {
        this.preventDefaultPropagation(e);
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
        return (  //todo: refactor html into subcomponents
            <form className="form-new-entry" onSubmit={this.saveNewEntry.bind(this)}>
                <div className="form-new-entry__elements">
                    <div className="form-new-entry__element form-new-entry__element--title">
                        <input type="text"
                               id="ww_title"
                               name="title"
                               value={this.state.title}
                               onChange={this.handleChange.bind(this)}
                               placeholder=' '
                        />
                        <label htmlFor="ww_title">Title...</label>
                    </div>
                    <div className="form-new-entry__element">
                        <input type="text"
                               id="ww_url"
                               name="url"
                               value={this.state.url}
                               onChange={this.handleChange.bind(this)}
                               placeholder=' '
                        />
                        <label htmlFor="ww_url">URL...</label>
                    </div>
                    <div className="form-new-entry__element">
                        <input type="checkbox"
                               id="ww_open-at-startup"
                               checked={this.state.openAtStartup}
                               name="openAtStartup"
                               onChange={e => {
                                   this.handleChange({target: {name: e.target.name, value: e.target.checked}});
                               }}/>
                        <label htmlFor="ww_open-at-startup">open at application startup</label>
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
                    <div className="form-new-entry__element">
                        <span className="ww-external-urls__head">External URLs</span>
                        {this.state.externalUrls.map(
                            externalUrl => {
                                return (
                                    <div className="ww-external-urls__entry" key={externalUrl.id}>
                                        <input type="text"
                                               className="ww-external-urls__entry--url-input"
                                               name={`external-urls__url--${externalUrl.id}`}
                                               value={externalUrl.url}
                                               placeholder="Url..."
                                               onChange={
                                                   ({target}) => {
                                                       externalUrl.url = target.value;
                                                       this.forceUpdate();
                                                   }
                                               }
                                        />
                                        <img alt="icon for deleting the external url entry"
                                             className="ww-external-urls__entry--delete-entry"
                                             src={deleteIcon}
                                             onClick={() => {
                                                 this.handleChange.call(this, {
                                                     target:
                                                         {
                                                             name: 'externalUrls',
                                                             value: this.state.externalUrls.filter(url => url.id !== externalUrl.id)
                                                         }
                                                 })
                                             }}/>
                                    </div>
                                );
                            }
                        )}
                        <img className="ww-external-urls__button-new-entry"
                             src={iconAdd}
                             onClick={() => {
                                 this.setState({
                                     externalUrls: [...this.state.externalUrls, {
                                         id: HashGeneratorFrontend.generateRandomHash(),
                                         url: ''
                                     }]
                                 });
                             }}
                             alt="icon for adding new entry to the list of external urls"/>
                    </div>
                    <input type="submit" className="ww-button"/>
                </div>
            </form>
        );
    }
}

export default FormNewEntry;
