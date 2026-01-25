<template>
    <view class="container page">
        <!-- Search Bar -->
        <view class="header">
            <view class="search-box">
                <view class="search-input-wrapper">
                    <view class="search-icon">
                        <uni-icons type="search" size="18" color="#999"></uni-icons>
                    </view>
                    <input type="text" placeholder="搜索积分商品..." placeholder-style="color:#999" />
                </view>
                <view class="filter-btn">
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
                    积分
                    <view class="icons">
                        <uni-icons type="up" size="10" color="#999"></uni-icons>
                    </view>
                </view>
                <view class="sort-item">
                    积分
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
                        <uni-icons type="image" size="60" color="#333" style="opacity: 0.5"></uni-icons>
                    </view>
                </view>
                <view class="product-info">
                    <text class="product-title">{{ item.title }}</text>
                    <view class="product-bottom">
                        <text class="product-price">{{ item.points }} 积分</text>
                        <button class="buy-btn">点击咨询</button>
                    </view>
                </view>
            </view>
        </scroll-view>

        <CustomTabbar active="points" />
    </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import CustomTabbar from '@/components/CustomTabbar.vue';

const currentCategory = ref(0);
const categories = ref(['全部', '厨房电器', '生活电器', '个护健康']);
const products = ref([
    {
        title: '高端智能电饭煲 5L',
        points: '5000',
        bgColor: '#FDD835' // Yellow
    },
    {
        title: '多功能早餐机',
        points: '2500',
        bgColor: '#FB8C00' // Orange
    },
    {
        title: '水果榨汁机',
        points: '2500',
        bgColor: '#bbf1a9' //
    },
    {
        title: '面包机',
        points: '2500',
        bgColor: '#e43c2f' // Orange
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
