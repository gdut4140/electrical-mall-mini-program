<template>
	<view class="container page">
		<!-- User Header -->
		<view class="user-header">
			<view class="avatar">
				<uni-icons type="person-filled" size="45" color="#fff"></uni-icons>
			</view>
			<view class="user-info">
				<text class="user-name">{{ profile.nickname || '微信用户' }}</text>
				<text class="user-role">{{ profile.phone || '尊敬的会员' }}</text>
			</view>
		</view>

		<view class="action-row">
			<button class="action-btn" @click="loginWithWechat">微信认证登录</button>
			<button class="action-btn outline" @click="openQrcode">企业认证二维码</button>
			<button class="action-btn outline" @click="openAd">广告</button>
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

		<!-- Ad Popup -->
		<view v-if="showAd" class="popup-mask" @click="closeAd">
			<view class="popup" @click.stop>
				<text class="popup-title">广告</text>
				<image src="/static/advertise.jpg" class="popup-image" mode="widthFix"></image>
				<button class="popup-btn" @click="closeAd">关闭</button>
			</view>
		</view>
		<CustomTabbar active="user" />
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import CustomTabbar from '@/components/CustomTabbar.vue';
import { wechatLogin, getMemberProfile, getPointsRecords, getWechatQrcode } from '@/api/apiMethods';

const profile = ref({});
const history = ref([]);
const page = ref(1);
const size = ref(10);
const total = ref(0);
const loading = ref(false);
const finished = ref(false);
const qrcodeUrl = ref('');
const showQrcode = ref(false);
const showAd = ref(false);

const loginWithWechat = async () => {
	try {
		const code = await new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: (res) => resolve(res.code),
				fail: reject
			});
		});
		const data = await wechatLogin({ code });
		uni.setStorageSync('token', data.token);
		await loadProfile();
		resetAndFetch();
	} catch (error) {
		uni.showToast({ title: '登录失败', icon: 'none' });
	}
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

const openAd = () => {
	showAd.value = true;
};

const closeAd = () => {
	showAd.value = false;
};

const initQrcode = async () => {
	qrcodeUrl.value = await getWechatQrcode();
};

onShow(() => {
	uni.hideTabBar({ animation: false });
	const token = uni.getStorageSync('token');
	if (token) {
		loadProfile();
		if (!history.value.length) {
			resetAndFetch();
		}
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
	margin-bottom: 25px;

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
