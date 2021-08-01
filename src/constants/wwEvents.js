const wwEvents = Object.freeze({
        SETTINGS_WINDOW_OPENED: Symbol("request to open settings-window"),
        SETTINGS_WINDOW_REQ_SETTINGS: Symbol("requesting user settings"),
        SETTINGS_WINDOW_REQ_SETTINGS_RESPONSE: Symbol("response for user settings request"),
        SETTINGS_WINDOW_REQ_SAVE_SETTINGS: Symbol("request to save new settings entry"),
        SETTINGS_WINDOW_REQ_SAVE_SETTINGS_RESPONSE: Symbol("response telling that the new settings were saved"),
        SETTINGS_WINDOW_REQ_REMOVE_WEBSITES: Symbol("request to remove all windows from user-settings"),
        SETTINGS_WINDOW_REQ_REMOVE_WEBSITES_RESPONSE: Symbol("response telling that all windows from user-settings were deleted")
    }
)
module.exports = wwEvents;
