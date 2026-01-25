<template>
	<view class="container page">
		<!-- Search Bar -->
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<view class="search-icon">
						<uni-icons type="search" size="18" color="#999"></uni-icons>
					</view>
					<input type="text" placeholder="搜索商品名称..." placeholder-style="color:#999" />
				</view>
				<view class="filter-btn">
					<uni-icons type="tune" size="24" color="#666"></uni-icons>
				</view>
			</view>

			<!-- Categories -->
			<scroll-view class="category-scroll" scroll-x="true" show-scrollbar="false">
				<view class="category-list">
					<view v-for="(item, index) in categories" :key="index" class="category-item" :class="{ active: currentCategory === index }" @click="changeCategory(index)">
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
		<scroll-view scroll-y="true" class="product-list">
			<view class="product-card" v-for="(item, index) in products" :key="index">
				<view class="product-image-placeholder" :style="{ backgroundColor: item.bgColor }">
					<view class="placeholder-icon">
						<uni-icons type="image" size="60" color="#fff"></uni-icons>
					</view>
				</view>
				<view class="product-info">
					<text class="product-title">{{ item.title }}</text>
					<view class="product-bottom">
						<text class="product-price">¥{{ item.price }}</text>
						<button class="buy-btn">点击咨询</button>
					</view>
				</view>
			</view>
		</scroll-view>

		<CustomTabbar active="home" />
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import CustomTabbar from '@/components/CustomTabbar.vue';

const currentCategory = ref(0);
const categories = ref(['全部', '电视', '冰箱', '空调', '洗衣机', '生活电器']);
const products = ref([
	{
		title: 'XX品牌 8K超高清智能电视 75英寸',
		price: '8999',
		bgColor: '#F56C6C' // Reddish
	},
	{
		title: 'XX品牌 变频节能立式空调 3匹',
		price: '4599',
		bgColor: '#4CD964' // Greenish
	},
	{
		title: 'XX品牌 智能滚筒洗衣机 10kg',
		price: '3299',
		bgColor: '#5AC8FA' // Bluish
	},
	{
		title: 'XX品牌 双门冰箱 450L',
		price: '2899',
		bgColor: '#FF9500' // Orangish
	}
]);

const changeCategory = (index) => {
	currentCategory.value = index;
};

onShow(() => {
	uni.hideTabBar({ animation: false });
});
</script>

<style lang="scss" scoped></style>
