export const loadJSON = <T,>(key: string): T | undefined => {
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return undefined;
        return JSON.parse(raw) as T;
    } catch (err) {
        // ignore JSON parse errors, return undefined
        // eslint-disable-next-line no-console
        console.warn('Failed to load from localStorage', key, err);
        return undefined;
    }
};

export const saveJSON = (key: string, value: unknown): void => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        // ignore quota errors
        // eslint-disable-next-line no-console
        console.warn('Failed to save to localStorage', key, err);
    }
};

export const removeKey = (key: string): void => {
    try {
        window.localStorage.removeItem(key);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Failed to remove localStorage key', key, err);
    }
};
