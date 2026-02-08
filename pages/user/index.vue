<template>
	<view class="container page">
		<!-- User Header -->
		<view class="user-header">
			<view class="user-main">
				<view class="avatar">
					<uni-icons type="person-filled" size="45" color="#fff"></uni-icons>
				</view>
				<view class="user-info">
					<text class="user-name">{{ profile.nickname || '微信用户' }}</text>
					<text class="user-role">{{ profile.phone || '尊敬的会员' }}</text>
				</view>
			</view>
			<button v-if="isLoggedIn" class="logout-btn" @click="handleLogout">退出登录</button>
		</view>

		<view class="action-row">
			<button class="action-btn" open-type="getPhoneNumber" @getphonenumber="handlePhoneLogin">
				微信手机号一键登录
			</button>
			<button class="action-btn outline" @click="openQrcode">企业认证二维码</button>
		</view>

		<!-- Points Card -->
		<view class="points-card">
			<view class="card-content">
				<text class="card-label">当前可用积分</text>
				<text class="card-value">{{ profile.totalPoints || 0 }}</text>
			</view>
		</view>

		<!-- History List -->
		<view class="history-section">
			<text class="history-title">积分使用情况</text>

			<view class="history-list">
				<view class="history-item" v-for="(item, index) in history" :key="index">
					<view class="history-left">
						<text class="history-name">{{ item.changeType }}</text>
						<text class="history-time">{{ item.createdAt }}</text>
					</view>
					<text class="history-amount" :class="{ positive: item.points > 0, negative: item.points < 0 }">{{
						item.points > 0 ? '+' : '' }}{{ item.points }}</text>
				</view>
			</view>
			<view v-if="loading" class="list-tip">加载中...</view>
			<view v-else-if="finished" class="list-tip">没有更多了</view>
			<button v-else class="load-more" @click="loadMore">加载更多</button>
		</view>

		<!-- Qrcode Popup -->
		<view v-if="showQrcode" class="popup-mask" @click="closeQrcode">
			<view class="popup" @click.stop>
				<text class="popup-title">企业认证二维码</text>
				<image v-if="qrcodeUrl" :src="qrcodeUrl" class="popup-image" mode="widthFix"></image>
				<view v-else class="popup-empty">暂无二维码</view>
				<button class="popup-btn" @click="closeQrcode">关闭</button>
			</view>
		</view>

		<CustomTabbar active="user" />
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import CustomTabbar from '@/components/CustomTabbar.vue';
import api from '@/api/api';
import { getMemberProfile, getPointsRecords, getWechatQrcode } from '@/api/apiMethods';

const profile = ref({});
const history = ref([]);
const page = ref(1);
const size = ref(10);
const total = ref(0);
const loading = ref(false);
const finished = ref(false);
const qrcodeUrl = ref('');
const showQrcode = ref(false);
const isLoggedIn = ref(false);

const handlePhoneLogin = async (event) => {
	try {
		const phoneCode = event?.detail?.code;
		if (!phoneCode) {
			uni.showToast({ title: '获取手机号失败', icon: 'none' });
			return;
		}
		const code = await new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: (res) => resolve(res.code),
				fail: reject
			});
		});
		const data = await api.post('/auth/wechat-phone-login', {
			phoneCode,
			loginCode: code
		});
		uni.setStorageSync('token', data.token);
		profile.value = data.memberInfo || profile.value;
		isLoggedIn.value = true;
		await loadProfile();
		resetAndFetch();
	} catch (error) {
		uni.showToast({ title: '登录失败', icon: 'none' });
	}
};

const handleLogout = () => {
	uni.removeStorageSync('token');
	profile.value = {};
	history.value = [];
	page.value = 1;
	finished.value = false;
	isLoggedIn.value = false;
	uni.showToast({ title: '已退出登录', icon: 'none' });
};

const loadProfile = async () => {
	profile.value = await getMemberProfile();
};

const resetAndFetch = () => {
	page.value = 1;
	history.value = [];
	finished.value = false;
	fetchRecords();
};

const fetchRecords = async () => {
	if (loading.value || finished.value) return;
	loading.value = true;
	try {
		const data = await getPointsRecords({ page: page.value, size: size.value });
		const list = data.records || [];
		history.value = history.value.concat(list);
		total.value = data.total || 0;
		if (history.value.length >= total.value) {
			finished.value = true;
		} else {
			page.value += 1;
		}
	} finally {
		loading.value = false;
	}
};

const loadMore = () => {
	fetchRecords();
};

const openQrcode = () => {
	showQrcode.value = true;
};

const closeQrcode = () => {
	showQrcode.value = false;
};

const initQrcode = async () => {
	qrcodeUrl.value = await getWechatQrcode();
};

onShow(() => {
	uni.hideTabBar({ animation: false });
	const token = uni.getStorageSync('token');
	if (token) {
		isLoggedIn.value = true;
		loadProfile();
		if (!history.value.length) {
			resetAndFetch();
		}
	} else {
		isLoggedIn.value = false;
	}
});

initQrcode();
</script>

<style lang="scss" scoped>
.page {
	padding: 15px 15px 80px;
	box-sizing: border-box;
	background-color: #fff;
}

.user-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 25px;

	.user-main {
		display: flex;
		align-items: center;
	}

	.avatar {
		width: 65px;
		height: 65px;
		border-radius: 50%;
		background-color: #64b5f6;
		/* Light Blue */
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 15px;
		border: 4px solid #fff;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.user-info {
		display: flex;
		flex-direction: column;

		.user-name {
			font-size: 22px;
			font-weight: bold;
			color: #333;
			margin-bottom: 5px;
		}

		.user-role {
			font-size: 14px;
			color: #666;
		}
	}

	.logout-btn {
		background: #e53935;
		color: #fff;
		border-radius: 16px;
		font-size: 12px;
		line-height: 2.2;
		padding: 0 12px;
		margin: 0;
	}
}

.points-card {
	background-image: linear-gradient(135deg, #2979ff, #1565c0);
	border-radius: 15px;
	padding: 30px 25px;
	margin-bottom: 30px;
	box-shadow: 0 5px 15px rgba(41, 121, 255, 0.3);

	.card-label {
		color: rgba(255, 255, 255, 0.8);
		font-size: 14px;
		margin-bottom: 10px;
		display: block;
	}

	.card-value {
		color: #fff;
		font-size: 40px;
		font-weight: bold;
	}
}

.action-row {
	display: flex;
	gap: 10px;
	margin-bottom: 20px;

	.action-btn {
		flex: 1;
		background: #2979ff;
		color: #fff;
		border-radius: 20px;
		font-size: 12px;
		line-height: 2.2;
		padding: 0 10px;

		&.outline {
			background: #fff;
			color: #2979ff;
			border: 1px solid #2979ff;
		}
	}
}

.history-section {
	.history-title {
		font-size: 18px;
		font-weight: bold;
		color: #333;
		margin-bottom: 15px;
		display: block;
	}

	.history-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
		background-color: #f9f9f9;
		/* Very light grey */
		border-radius: 10px;
		margin-bottom: 10px;

		.history-left {
			display: flex;
			flex-direction: column;

			.history-name {
				font-size: 16px;
				color: #333;
				margin-bottom: 5px;
			}

			.history-time {
				font-size: 12px;
				color: #999;
			}
		}

		.history-amount {
			font-size: 18px;
			font-weight: bold;

			&.positive {
				color: #4caf50;
			}

			&.negative {
				color: #f44336;
			}
		}
	}
}

.list-tip {
	text-align: center;
	color: #999;
	font-size: 12px;
	padding: 10px 0 10px;
}

.load-more {
	margin: 10px auto 0;
	width: 120px;
	background: #f5f5f5;
	color: #666;
	border-radius: 16px;
	font-size: 12px;
}

.popup-mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.popup {
	width: 80%;
	background: #fff;
	border-radius: 12px;
	padding: 20px;
	box-sizing: border-box;
	text-align: center;
}

.popup-title {
	font-size: 16px;
	font-weight: bold;
	color: #333;
	margin-bottom: 10px;
	display: block;
}

.popup-image {
	width: 100%;
	border-radius: 8px;
}

.popup-empty {
	color: #999;
	padding: 20px 0;
}

.popup-btn {
	margin-top: 12px;
	background: #2979ff;
	color: #fff;
	border-radius: 20px;
	font-size: 14px;
}
</style>
