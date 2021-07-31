import {Component, ReactNode} from "react";
import toggleIcon from "../../../../assets/icons/toggle.svg";
import * as React from "react";

export default class FormNewData extends Component<any, { visibilityForm: boolean }> {

    private imgPath: string = null;

    /**
     *
     * @param props
     */
    constructor(props: any) {
        super(props);
        this.state = {visibilityForm: false};
    }

    componentDidMount() {
        this.handleDefinedEvents()
    }

    /**
     *
     * @private
     */
    private handleDefinedEvents() {
        // const wsFormNewEntryButton = document.getElementsByClassName('ww-button')[0];
        // const wsFormNewEntryImg = document.getElementsByClassName('ww-img')[0];
        // wsFormNewEntryImg.addEventListener('dragdrop', (e: DragEvent) => {
        //     this.persistIconPath(e);
        // }, false);
    }

    /**
     *
     * @param e
     * @private
     */
    private static preventDefaultPropagation(e: any) {
        e.stopPropagation();
        e.preventDefault();
    }

    /**
     *
     * @private
     */
    private saveNewEntry() {
        // @ts-ignore
        const title: string = document.getElementById('ww_title').value;
        // @ts-ignore
        const url: string = document.getElementById('ww_url').value;
        // @ts-ignore
        window.electron.saveNewEntry(title ? title : 'Title', url ? url : 'https://www.ecosia.org/', this.imgPath).then((value) => {
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
     * @private
     */
    private persistIconPath(e: any) {
        e.stopPropagation();
        e.preventDefault();
        const dt = e.dataTransfer;
        const file = dt?.files[0];
        if (!file.type.startsWith('image/png')) {
            throw 'Error saving icon. Wrong format.'
        }
        this.imgPath = file.path;
    }

    render(): ReactNode {
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
                         onDragEnter={e => FormNewData.preventDefaultPropagation(e)}
                         onDragOver={e => FormNewData.preventDefaultPropagation(e)}
                         onDragLeave={e => FormNewData.preventDefaultPropagation(e)}
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
