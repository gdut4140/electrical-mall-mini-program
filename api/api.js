import axios from 'axios';

// 接口基础地址
const BASE_URL = 'http://localhost:8083/api/miniapp';

// Toggle mock responses for local development.
const USE_MOCK = true;

const MOCK_MEMBER = {
    id: 1,
    openid: 'mock-openid-001',
    nickname: 'Mock User',
    avatar: 'https://dummyimage.com/100x100/5b9bd5/ffffff&text=U',
    phone: '13800000000',
    totalPoints: 1200,
    createdAt: '2024-01-01T10:00:00',
    updatedAt: '2024-01-01T10:00:00'
};

const MOCK_PRODUCTS = [
    {
        id: 1,
        name: 'Smart TV 55"',
        image: '/static/advertise.jpg',
        detailImages: ['/static/advertise.jpg'],
        category: '电视',
        type: 1,
        price: 2999,
        pointsPrice: 0,
        description: '4K smart TV',
        status: 1,
        sortOrder: 1,
        createdAt: '2024-01-01T10:00:00',
        updatedAt: '2024-01-01T10:00:00'
    },
    {
        id: 2,
        name: 'Inverter AC 1.5P',
        image: '/static/advertise.jpg',
        detailImages: ['/static/advertise.jpg'],
        category: '空调',
        type: 1,
        price: 2599,
        pointsPrice: 0,
        description: 'Energy saving AC',
        status: 1,
        sortOrder: 2,
        createdAt: '2024-01-01T10:00:00',
        updatedAt: '2024-01-01T10:00:00'
    },
    {
        id: 3,
        name: 'Double Door Fridge',
        image: '/static/advertise.jpg',
        detailImages: ['/static/advertise.jpg'],
        category: '冰箱',
        type: 1,
        price: 1999,
        pointsPrice: 0,
        description: 'Large capacity fridge',
        status: 1,
        sortOrder: 3,
        createdAt: '2024-01-01T10:00:00',
        updatedAt: '2024-01-01T10:00:00'
    },
    {
        id: 4,
        name: 'Mini Washing Machine',
        image: '/static/advertise.jpg',
        detailImages: ['/static/advertise.jpg'],
        category: '洗衣机',
        type: 1,
        price: 999,
        pointsPrice: 0,
        description: 'Compact washer',
        status: 1,
        sortOrder: 4,
        createdAt: '2024-01-01T10:00:00',
        updatedAt: '2024-01-01T10:00:00'
    },
    {
        id: 101,
        name: 'Kitchen Blender',
        image: '/static/advertise.jpg',
        detailImages: ['/static/advertise.jpg'],
        category: '厨房电器',
        type: 2,
        price: 0,
        pointsPrice: 800,
        description: 'Points item',
        status: 1,
        sortOrder: 1,
        createdAt: '2024-01-01T10:00:00',
        updatedAt: '2024-01-01T10:00:00'
    },
    {
        id: 102,
        name: 'Electric Kettle',
        image: '/static/advertise.jpg',
        detailImages: ['/static/advertise.jpg'],
        category: '生活电器',
        type: 2,
        price: 0,
        pointsPrice: 500,
        description: 'Points item',
        status: 1,
        sortOrder: 2,
        createdAt: '2024-01-01T10:00:00',
        updatedAt: '2024-01-01T10:00:00'
    },
    {
        id: 103,
        name: 'Hair Dryer',
        image: '/static/advertise.jpg',
        detailImages: ['/static/advertise.jpg'],
        category: '个护健康',
        type: 2,
        price: 0,
        pointsPrice: 600,
        description: 'Points item',
        status: 1,
        sortOrder: 3,
        createdAt: '2024-01-01T10:00:00',
        updatedAt: '2024-01-01T10:00:00'
    }
];

const MOCK_POINTS_RECORDS = [
    {
        id: 1,
        memberId: 1,
        memberNickname: 'Mock User',
        memberPhone: '13800000000',
        changeType: '消费赠送',
        points: 100,
        balanceBefore: 1100,
        balanceAfter: 1200,
        operatorType: 'system',
        operatorName: 'system',
        createdAt: '2024-01-02T10:00:00',
        remark: 'mock'
    },
    {
        id: 2,
        memberId: 1,
        memberNickname: 'Mock User',
        memberPhone: '13800000000',
        changeType: '积分兑换',
        points: -200,
        balanceBefore: 1400,
        balanceAfter: 1200,
        operatorType: 'system',
        operatorName: 'system',
        createdAt: '2024-01-03T10:00:00',
        remark: 'mock'
    }
];

const paginate = (items, page = 1, size = 10) => {
    const start = (page - 1) * size;
    const end = start + size;
    const records = items.slice(start, end);
    const total = items.length;
    return {
        total,
        pages: Math.ceil(total / size),
        current: page,
        size,
        records
    };
};

const filterProducts = (params = {}) => {
    const { type, category, name, status } = params;
    return MOCK_PRODUCTS.filter((item) => {
        if (type && Number(item.type) !== Number(type)) return false;
        if (category && item.category !== category) return false;
        if (name && !item.name.toLowerCase().includes(String(name).toLowerCase())) return false;
        if (status !== undefined && status !== null && status !== '' && Number(item.status) !== Number(status)) {
            return false;
        }
        return true;
    });
};

// 将 params 转为 query string
const buildQuery = (params = {}) => {
    const keys = Object.keys(params).filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== '');
    if (!keys.length) return '';
    const query = keys
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    return `?${query}`;
};

// 适配 uni.request 到 axios
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

// axios 实例
const service = axios.create({
    baseURL: BASE_URL,
    timeout: 15000
});

// 使用 uni.request 作为适配层
const mockAdapter = (config) => {
    const url = config.url || '';
    const method = (config.method || 'GET').toUpperCase();
    const params = config.params || {};

    const ok = (data) =>
        Promise.resolve({
            data: { code: 200, message: 'ok', data },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: null
        });

    if (url === '/auth/wechat-login' && method === 'POST') {
        return ok({ token: 'mock-token-123', memberInfo: MOCK_MEMBER, isNewUser: false });
    }

    if (url === '/members/profile' && method === 'GET') {
        return ok(MOCK_MEMBER);
    }

    if (url === '/products' && method === 'GET') {
        const list = filterProducts(params);
        return ok(paginate(list, Number(params.page || 1), Number(params.size || 10)));
    }

    if (url === '/points-records' && method === 'GET') {
        return ok(paginate(MOCK_POINTS_RECORDS, Number(params.page || 1), Number(params.size || 10)));
    }

    if (url === '/system-configs/wechat-qrcode' && method === 'GET') {
        return ok('https://dummyimage.com/300x300/5b9bd5/ffffff&text=QR');
    }

    if (url === '/test/health' && method === 'GET') {
        return ok('mock ok');
    }

    return ok({});
};

service.defaults.adapter = USE_MOCK ? mockAdapter : uniAxiosAdapter;

// 请求拦截：自动添加 token / Content-Type
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

// 响应拦截：统一处理 Result 结构
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
