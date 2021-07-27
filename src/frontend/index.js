import "./styles/index.scss";


class EntryRenderer {
    constructor() {
        this.imgPath = null;
        this.entryWrapper = document.getElementById('website-entries');
        this.renderWebsiteEntries();
        this.handleDefinedEvents();
    }

    handleDefinedEvents() {
        const wsEntriesToggle = document.getElementsByClassName('website-entries__toggle')[0];
        const wbEntries = document.getElementById('website-entries');
        wsEntriesToggle.addEventListener('click', () => {
            wbEntries.classList.toggle('website-entries--hidden');
        });

        const wsFormNewEntryToggle = document.getElementsByClassName('form-new-entry__toggle')[0];
        const wsFormNewEntry = document.getElementById('form-new-entry');
        wsFormNewEntryToggle.addEventListener('click', () => {
            wsFormNewEntry.classList.toggle('form-new-entry--hidden');
        });

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

    renderWebsiteEntries() {
        window.electron.websiteEntries.then(result => {
            result.forEach(entry => {
                const newChild = this.buildHtml(entry);
                this.entryWrapper.appendChild(newChild);
            });
        }).catch(e => {
            throw `Error loading user-defined list of websites: ${e}`
        })
    }

    /**
     *
     * @param entry
     * @returns {HTMLDivElement}
     */
    buildHtml(entry) {
        const temp = document.createElement('div');
        temp.classList.add('website-entries__element')
        const img = entry.iconPath ? `<img alt="Icon of entry ${entry.title}" src="${entry.iconPath}" class="element_icon">` : '';
        temp.innerHTML = `<h2 class="element_title"><span>${entry.title}</span>${img}</h2><div class="element__url">${entry.url}</div>`;
        return temp;
    }

    saveNewEntry() {
        const title = document.getElementById('ww_title').value;
        const url = document.getElementById('ww_url').value;
        window.electron.saveNewEntry(title, url, this.imgPath).then((value) => {
            if (value) {
                window.location.reload();
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
}

new EntryRenderer();
