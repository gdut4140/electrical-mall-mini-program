import { wechatLogin, getMemberProfile, getProducts, getPointsProducts, getPointsRecords, getWechatQrcode, getHealth } from './apiMethods';

export const exampleUsage = async () => {
    const loginRes = await new Promise((resolve, reject) => {
        uni.login({
            provider: 'weixin',
            success: (res) => resolve(res.code),
            fail: reject
        });
    });
    const loginData = await wechatLogin({ code: loginRes });
    uni.setStorageSync('token', loginData.token);

    const profile = await getMemberProfile();
    const products = await getProducts({ page: 1, size: 10 });
    const pointsProducts = await getPointsProducts({ page: 1, size: 10 });
    const pointsRecords = await getPointsRecords({ page: 1, size: 10 });
    const qrcodeUrl = await getWechatQrcode();
    const health = await getHealth();

    return {
        profile,
        products,
        pointsProducts,
        pointsRecords,
        qrcodeUrl,
        health
    };
};
