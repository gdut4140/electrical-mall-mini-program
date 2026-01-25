<template>
	<view class="container page">
		<!-- User Header -->
		<view class="user-header">
			<view class="avatar">
				<uni-icons type="person-filled" size="45" color="#fff"></uni-icons>
			</view>
			<view class="user-info">
				<text class="user-name">王女士</text>
				<text class="user-role">尊敬的会员</text>
			</view>
		</view>

		<!-- Points Card -->
		<view class="points-card">
			<view class="card-content">
				<text class="card-label">当前可用积分</text>
				<text class="card-value">12,500</text>
			</view>
		</view>

		<!-- History List -->
		<view class="history-section">
			<text class="history-title">积分使用情况</text>

			<view class="history-list">
				<view class="history-item" v-for="(item, index) in history" :key="index">
					<view class="history-left">
						<text class="history-name">{{ item.name }}</text>
						<text class="history-time">{{ item.time }}</text>
					</view>
					<text class="history-amount" :class="{ positive: item.amount > 0, negative: item.amount < 0 }">{{ item.amount > 0 ? '+' : '' }}{{ item.amount }}</text>
				</view>
			</view>
		</view>
		<CustomTabbar active="user" />
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import CustomTabbar from '@/components/CustomTabbar.vue';

const history = ref([
	{
		name: '消费赠送 (购买冰箱)',
		time: '2025-11-22 10:30',
		amount: 1000
	},
	{
		name: '积分兑换 (电饭煲)',
		time: '2025-11-21 14:05',
		amount: -5000
	},
	{
		name: '新会员注册',
		time: '2025-11-20 09:00',
		amount: 100
	}
]);

onShow(() => {
	uni.hideTabBar({ animation: false });
});
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
</style>
