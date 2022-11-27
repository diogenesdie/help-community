import axios from "axios";

let baseURL = typeof document === 'object' ? document.location.origin : "http://localhost:3000";
let timeout = 10000;

// Get URL from environment variable
if (process.env.API_URL) {
    baseURL = process.env.API_URL;
}

// Get timeout from environment variable
if (process.env.API_TIMEOUT) {
    timeout = parseInt(process.env.API_TIMEOUT);
}

export const isCancel = axios.isCancel;
export const isClientError = axios.isAxiosError;

const httpClient = axios.create({
    baseURL: baseURL,
    timeout: timeout,
    headers: {
        "Content-Type": "application/json",
    },
    validateStatus: status => true
});

export default httpClient;