<template>
	<view class="set_page">
		<view class="set_map"><button size="mini" type="primary" @click="GetChooseLocation">选择位置设置</button></view>
		<view class="container">
			<view class="item">
				<text class="left">位置:</text>
				<input class="right" type="text" v-model="setting.address" placeholder="请选择设定位置" />
			</view>
			<view class="item">
				<text class="left">经度:</text>
				<input class="right" type="text" v-model="setting.Longitude" placeholder="打卡经纬度设置" />
			</view>
			<view class="item">
				<text class="left">纬度:</text>
				<input class="right" type="text" v-model="setting.Latitude" placeholder="打卡经纬度设置" />
			</view>
			<view class="item">
				<text class="left">范围1:</text>
				<input class="right" type="text" v-model="setting.Distance_Out" placeholder="外出打卡范围设置" />
			</view>
			<view class="item">
				<text class="left">范围2:</text>
				<input class="right" type="text" v-model="setting.Distance_In" placeholder="公司打卡范围设置" />
			</view>
		</view>

		<view class="btn"><button type="primary" class="set_btn" @click="SetUp">设置</button></view>

		<view class="tips">
			<view class="box">
				<text class="title">范围1:</text>
				<text class="content">外出位置半径设置,设置0.001表示设置半径100米</text>
			</view>
			<view class="box">
				<text class="title">范围2:</text>
				<text class="content">公司位置半径设置,设置0.001表示设置半径100米</text>
			</view>
			<view class="box">
				<text class="title">tips:</text>
				<text class="content">该设定的经纬度为公司的所在地址</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			setting: {
				_id: '',
				address: '',
				Longitude: 0,
				Latitude: 0,
				Distance_In: 0,
				Distance_Out: 0
			}
		};
	},
	onLoad() {
		uni.showLoading({
			title: '加载中'
		});
		
		//获取设定好的地址坐标（经纬度）
		uniCloud
			.callFunction({
				name: 'ClockIn-get-location'
			})
			.then(res => {
				if (res.result.length > 0) {
					let result = res.result[0];
					Object.assign(this.setting, result)
				}
				uni.hideLoading();
			});
	},
	methods: {
		//选择地址
		GetChooseLocation() {
			uni.chooseLocation({
				success: res => {
					this.setting.Longitude = res.longitude;
					this.setting.Latitude = res.latitude;
					this.setting.address = res.address;
				}
			});
		},
		SetUp() {
			uni.showLoading({
				title: '正在提交中'
			});
			uniCloud
				.callFunction({
					name: 'ClockIn-update-location',
					data: this.setting
				})
				.then(res => {
					uni.hideLoading();
					uni.showToast({
						title: '设置成功',
						duration: 2000
					});
				});
		}
	}
};
</script>

<style lang="scss">
.set_page {
	.set_map {
		width: 40%;
		margin: 20rpx;
		button {
			background-color: #1890ff;
		}
	}
	.container {
		width: 92%;
		margin: 20rpx auto;
		padding: 10rpx;
		box-shadow: 0 4rpx 16rpx 0 rgba(0, 51, 128, 0.2);
		border-radius: 4rpx;
		.item {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			.left {
				width: 150rpx;
				padding: 10rpx 0;
				text-align: center;
			}
			.right {
				flex: 1;
				border-bottom: 1px solid #ebeef5;
				padding: 10rpx 0;
				padding-left: 10rpx;
			}
		}
	}
	.btn {
		width: 60%;
		margin: 30upx auto;
		.set_btn {
			height: 87rpx;
			line-height: 87rpx;
			color: #fff;
			border-radius: 47rpx;
			background-color: #1890ff;
		}
	}
	.tips {
		width: 90%;
		margin: 10rpx auto;

		.box {
			margin-bottom: 20rpx;
			display: flex;
			font-size: 30rpx;
			.title {
				width: 120rpx;
				font-weight: 600;
				text-align: center;
				padding-right: 15rpx;
			}
			.content {
				flex: 1;
			}
		}
	}
}
</style>
