<template>
	<view class="container page">
		<!-- Search Bar -->
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<view class="search-icon">
						<uni-icons type="search" size="18" color="#999"></uni-icons>
					</view>
					<input type="text" v-model="searchKeyword" placeholder="搜索商品名称..." placeholder-style="color:#999"
						@confirm="handleSearch" />
				</view>
				<view class="filter-btn" @click="openAd">
					<uni-icons type="tune" size="24" color="#666"></uni-icons>
				</view>
			</view>

			<!-- Categories -->
			<scroll-view class="category-scroll" scroll-x="true" show-scrollbar="false">
				<view class="category-list">
					<view v-for="(item, index) in categories" :key="index" class="category-item"
						:class="{ active: currentCategory === index }" @click="changeCategory(index)">
						<text>{{ item }}</text>
					</view>
				</view>
			</scroll-view>

			<!-- Sorting -->
			<view class="sort-bar">
				<view class="sort-item active">综合排序</view>
				<view class="sort-item">
					价格
					<view class="icons">
						<uni-icons type="up" size="10" color="#999"></uni-icons>
					</view>
				</view>
				<view class="sort-item">
					价格
					<view class="icons">
						<uni-icons type="down" size="10" color="#999"></uni-icons>
					</view>
				</view>
			</view>
		</view>

		<!-- Product List -->
		<scroll-view scroll-y="true" class="product-list" @scrolltolower="loadMore">
			<view class="product-card" v-for="(item, index) in products" :key="item.id || index">
				<view class="product-image-placeholder">
					<image v-if="item.image" :src="item.image" class="product-image" mode="aspectFill"></image>
					<view v-else class="placeholder-icon">
						<uni-icons type="image" size="60" color="#fff"></uni-icons>
					</view>
				</view>
				<view class="product-info">
					<text class="product-title">{{ item.name }}</text>
					<view class="product-bottom">
						<text class="product-price">¥{{ item.price }}</text>
						<button class="buy-btn" @click="openQrcode">点击咨询</button>
					</view>
				</view>
			</view>
			<view v-if="loading" class="list-tip">加载中...</view>
			<view v-else-if="finished" class="list-tip">没有更多了</view>
		</scroll-view>

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

		<CustomTabbar active="home" />
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import CustomTabbar from '@/components/CustomTabbar.vue';
import { getProducts, getWechatQrcode, getHealth } from '@/api/apiMethods';

const currentCategory = ref(0);
const categories = ref(['全部', '电视', '冰箱', '空调', '洗衣机', '生活电器']);
const products = ref([]);
const searchKeyword = ref('');
const page = ref(1);
const size = ref(10);
const total = ref(0);
const loading = ref(false);
const finished = ref(false);
const qrcodeUrl = ref('');
const showQrcode = ref(false);
const showAd = ref(false);

const changeCategory = (index) => {
	currentCategory.value = index;
	resetAndFetch();
};

const handleSearch = () => {
	resetAndFetch();
};

const resetAndFetch = () => {
	page.value = 1;
	products.value = [];
	finished.value = false;
	fetchProducts();
};

const fetchProducts = async () => {
	if (loading.value || finished.value) return;
	loading.value = true;
	const category = categories.value[currentCategory.value];
	const params = {
		page: page.value,
		size: size.value,
		name: searchKeyword.value,
		category: category === '全部' ? '' : category,
		status: 1,
		type: 1
	};
	try {
		const data = await getProducts(params);
		const list = data.records || [];
		products.value = products.value.concat(list);
		total.value = data.total || 0;
		if (products.value.length >= total.value) {
			finished.value = true;
		} else {
			page.value += 1;
		}
	} finally {
		loading.value = false;
	}
};

const loadMore = () => {
	fetchProducts();
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
	if (!products.value.length) {
		resetAndFetch();
	}
});

initQrcode();
getHealth();
</script>

<style lang="scss" scoped>
.product-image {
	width: 100%;
	height: 180px;
	display: block;
}

.list-tip {
	text-align: center;
	color: #999;
	font-size: 12px;
	padding: 10px 0 20px;
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
