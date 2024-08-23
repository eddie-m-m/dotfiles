"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = request;
const config_1 = require("../../../config");
const utils_1 = require("../../utils");
async function request(path, init) {
    try {
        const response = await fetch(`${config_1.Settings.api.url}/${path}`, {
            method: 'GET',
            credentials: 'include',
            cache: 'default',
            ...init,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "User-Agent": utils_1.UserAgent,
                ...init?.headers,
            },
        });
        let error;
        let body;
        const contentType = response.headers.get("Content-Type");
        if (response.status > 0 && response.status < 300) {
            if (response.status !== 204) {
                try {
                    if (contentType && contentType.includes("application/json")) {
                        body = (await response.json());
                    }
                    else if (contentType && contentType.includes("text/html")) {
                        body = (await response.text());
                    }
                    else if (contentType && contentType.includes("application/pdf")) {
                        body = (await response.blob());
                    }
                    else {
                        body = await response.text(); // Fallback to text if content type is unknown
                    }
                }
                catch (e) {
                    error = await response.text();
                }
            }
            else {
                console.info(path, init?.method || 'GET', response.status, response.statusText);
            }
        }
        else {
            error = await response.text();
            if (error) {
                try {
                    error = JSON.parse(error);
                    error = error.message || error.error || error;
                }
                catch (e) {
                    console.error(path, init?.method || 'GET', e, response.status, response.statusText);
                }
            }
            console.error(path, init?.method || 'GET', error, response.status, response.statusText);
        }
        return {
            status: response.status,
            statusText: response.statusText,
            body,
            headers: response.headers,
            error,
            isLoading: false,
        };
    }
    catch (e) {
        console.error(path, init?.method || 'GET', e);
        return {
            status: 0,
            statusText: '',
            body: undefined,
            headers: undefined,
            error: e.message || e + '',
            isLoading: false,
        };
    }
}
//# sourceMappingURL=index.js.map