<template>
	<view class="TimeRecode_page">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">打卡记录</block>
		</cu-custom>
		<view class="header-search">
		<button class="mini-btn" type="primary" size="mini" @click="open">选择打卡日期</button>
		</view>
		<uni-calendar :insert="false" ref="calendar" :lunar="false" @confirm="confirm"></uni-calendar>

		<template v-if="RecordList.length > 0 && Loading === true">
			<timeline>
				<block v-for="(item, index) in RecordList" :key="index">
					<timelineItem :leftTime="index === 0 ? '打卡记录' : ''">
						<view class="tripItem">
							<view class="tips">打卡地点:{{ item.ChockInPosition }}</view>
							<view class="tips">办公位置：{{ item.PositionType }}</view>
							<view class="tips">打卡时间：{{ item.ChockInTime }}</view>
							<view class="Photo" v-if="item.PhotoUrl.length > 0">
								<block v-for="(i, j) in item.PhotoUrl" :key="j">
									<view class="Photo_item" @click="previewImage(item.PhotoUrl)"><image :src="i" mode=""></image></view>
								</block>
							</view>
						</view>
					</timelineItem>
				</block>
			</timeline>
		</template>
		<template v-if="RecordList.length === 0 && Loading === true">
			<empty :Today="Today"></empty>
		</template>
	</view>
</template>

<script>
import empty from '@/components/empty/empty.vue';
import timeline from '@/components/chenbin-timeline/timeLine.vue';
import timelineItem from '@/components/chenbin-timeline/timelineItem.vue';
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';
export default {
	data() {
		return {
			RecordList: [], //打卡数据
			Loading: false,
			Today: '',
		};
	},
	components: {
		empty,
		timeline,
		timelineItem,
		uniCalendar
	},

	onShow() {
		uni.showLoading({
			title: '加载中'
		});
		this.GetRecordList();
	},
	methods: {
		previewImage(data) {
			uni.previewImage({
				urls: data,
				longPressActions: {
					itemList: [],
					success: function(res) {},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},

		//打开日历
		open() {
			this.$refs.calendar.open();
		},
		//选择时间确认
		confirm(e) {
			this.GetRecordList(e.fulldate);
		},
		//格式化今天时间
		dateFormat(fmt) {
			let date = new Date();
			let ret;
			const opt = {
				'Y+': date.getFullYear().toString(), // 年
				'm+': (date.getMonth() + 1).toString(), // 月
				'd+': date.getDate().toString(), // 日
				'H+': date.getHours().toString(), // 时
				'M+': date.getMinutes().toString(), // 分
				'S+': date.getSeconds().toString() // 秒
			};
			for (let k in opt) {
				ret = new RegExp('(' + k + ')').exec(fmt);
				if (ret) {
					fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
				}
			}
			return fmt;
		},
		//获取数据
		GetRecordList(keycodes) {
			var The_Day = keycodes || this.dateFormat('YYYY-mm-dd');
			uni.showLoading({
				title: '加载中'
			});
			uniCloud
				.callFunction({
					name: 'ClockIn-get',
					data: {
						val: The_Day
					}
				})
				.then(res => {
					if (res.flag === true) {
						this.RecordList = res.result.data;
						if (this.RecordList.length !== 0) {
							this.RecordList.forEach(item => {
								if (item.PositionType == 1) {
									item.PositionType = '出差办公';
								} else {
									item.PositionType = '公司办公';
								}
							});
						} else {
							if (keycodes === undefined || keycodes === '') {
								this.Today = '今天暂无打卡记录';
							} else {
								this.Today = `暂无${keycodes}数据`;
							}
						}
						setTimeout(() => {
							this.Loading = true;
							uni.hideLoading();
						}, 500);
					} else {
						this.Loading = false;
						uni.showToast({
							title: '获取数据失败',
							duration: 2000,
							icon: 'none'
						});
					}
				});
		}
	}
};
</script>

<style lang="scss">
.TimeRecode_page {
	.header-search{
		margin: 15upx auto;
		width: 92%;
		padding: 0 10upx;
	}
	.tripItem {
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.08);
		border-radius: 10px;
		margin-bottom: 30rpx;
		.title {
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}
		.tips {
			font-size: 22rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			margin-top: 20rpx;
		}
	}
	.Photo {
		padding: 20rpx 30rpx;
		display: flex;
		align-items: center;
		.Photo_item {
			padding-right: 10rpx;
			image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}
		}
	}
}
</style>
