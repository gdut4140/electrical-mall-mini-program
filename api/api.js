import axios from 'axios';

const BASE_URL = 'http://localhost:8083/api/miniapp';

const buildQuery = (params = {}) => {
    const keys = Object.keys(params).filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== '');
    if (!keys.length) return '';
    const query = keys
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    return `?${query}`;
};

const uniAxiosAdapter = (config) => {
    return new Promise((resolve, reject) => {
        // 约定：apiMethods 中 url 不带 query，统一使用 params 传参。
        const baseUrl = `${config.baseURL || ''}${config.url || ''}`;
        const query = buildQuery(config.params);
        const url = query ? (baseUrl.includes('?') ? `${baseUrl}&${query.slice(1)}` : `${baseUrl}${query}`) : baseUrl;
        uni.request({
            url,
            method: (config.method || 'GET').toUpperCase(),
            data: config.data,
            header: config.headers,
            timeout: config.timeout,
            success: (res) => {
                resolve({
                    data: res.data,
                    status: res.statusCode,
                    statusText: res.errMsg,
                    headers: res.header,
                    config,
                    request: null
                });
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};

const service = axios.create({
    baseURL: BASE_URL,
    timeout: 15000
});

service.defaults.adapter = uniAxiosAdapter;

service.interceptors.request.use(
    (config) => {
        config.headers = config.headers || {};
        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }
        const token = uni.getStorageSync('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

service.interceptors.response.use(
    (response) => {
        const res = response.data;
        if (res && res.code === 200) {
            return res.data;
        }
        if (res && res.code === 401) {
            uni.removeStorageSync('token');
        }
        const message = (res && res.message) || '请求失败';
        uni.showToast({ title: message, icon: 'none' });
        return Promise.reject(res);
    },
    (error) => {
        if (error.response?.status === 401) {
            uni.removeStorageSync('token');
        }
        uni.showToast({ title: '网络异常', icon: 'none' });
        return Promise.reject(error);
    }
);

export default service;
