const STORAGE_KEY = 'damage-history';

function getHistory() {
    if (!window.localStorage) return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveHistory(history) {
    if (!window.localStorage) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function addEntry(entry) {
    if (!window.localStorage) return;
    const history = getHistory();
    history.push(entry);
    const MAX_ENTRIES = 10;
    if (history.length > MAX_ENTRIES) {
        history.splice(0, history.length - MAX_ENTRIES);
    }
    saveHistory(history);
}

export default {
    getHistory,
    addEntry,
};
