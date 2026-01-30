import api from './api';

export const wechatLogin = (payload) => api.post('/auth/wechat-login', payload);

export const getMemberProfile = () => api.get('/members/profile');

export const getProducts = (params) => api.get('/products', { params });

export const getPointsProducts = (params) => api.get('/products', { params: { type: 2, ...params } });

export const getPointsRecords = (params) => api.get('/points-records', { params });

export const getWechatQrcode = () => api.get('/system-configs/wechat-qrcode');

export const getHealth = () => api.get('/test/health');
