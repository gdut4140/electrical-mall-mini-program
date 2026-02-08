<template>
    <view class="tabbar">
        <view v-for="item in items" :key="item.key" class="tab-item" :class="{ active: item.key === active }"
            @click="switchTo(item.page, item.key)">
            <uni-icons :type="item.icon" size="26" :color="item.key === active ? '#0A5CE5' : '#7A7E83'"></uni-icons>
            <text class="tab-text">{{ item.text }}</text>
        </view>
    </view>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    active: {
        type: String,
        default: 'home'
    }
})

const items = [
    { key: 'home', text: '全量商品', icon: 'home', page: '/pages/index/index' },
    { key: 'points', text: '积分商城', icon: 'gift', page: '/pages/points-mall/index' },
    { key: 'user', text: '个人中心', icon: 'person', page: '/pages/user/index' }
]

const switchTo = (url, key) => {
    if (key === props.active) return
    uni.switchTab({ url })
}
</script>

<style scoped lang="scss">
.tabbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: calc(60px + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    border-top: 1px solid #eee;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
    z-index: 2000;
    box-sizing: border-box;
}

.tab-item {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #7A7E83;
}

.tab-item.active {
    color: #0A5CE5;
    font-weight: 600;
}

.tab-text {
    margin-top: 2px;
}
</style>
