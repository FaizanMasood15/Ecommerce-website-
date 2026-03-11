const DEVICE_ID_KEY = 'funiro_device_id';

const randomId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const getDeviceId = () => {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;
    const next = randomId();
    localStorage.setItem(DEVICE_ID_KEY, next);
    return next;
};

export const createClientOrderRef = () => `ord-${randomId()}`;
