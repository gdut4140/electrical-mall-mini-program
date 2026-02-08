import {
    wechatLogin,
    getMemberProfile,
    getProducts,
    getPointsProducts,
    getPointsRecords,
    getWechatQrcode,
    getHealth
} from './apiMethods';

/**
 * 接口调用示例（仅用于参考，不会自动执行）
 * - 展示：微信登录获取 token
 * - 展示：携带 token 调用需要鉴权的接口
 * - 展示：分页参数 page/size 的用法
 */
export const exampleUsage = async () => {
    // 1) 先通过微信登录拿到 code
    const wechatCode = await new Promise((resolve, reject) => {
        uni.login({
            provider: 'weixin',
            success: (res) => resolve(res.code),
            fail: reject
        });
    });

    // 2) 用 code 换取 token（后台接口：/auth/wechat-login）
    const loginData = await wechatLogin({ code: wechatCode });
    uni.setStorageSync('token', loginData.token);

    // 3) 需要鉴权的接口调用示例
    const profile = await getMemberProfile();

    // 4) 商品列表（全量商品）分页示例
    const products = await getProducts({ page: 1, size: 10 });

    // 5) 积分商品分页示例（type=2 已在方法内处理）
    const pointsProducts = await getPointsProducts({ page: 1, size: 10 });

    // 6) 积分记录分页示例
    const pointsRecords = await getPointsRecords({ page: 1, size: 10 });

    // 7) 企业微信二维码
    const qrcodeUrl = await getWechatQrcode();

    // 8) 健康检查（一般用于联调）
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
