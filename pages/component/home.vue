<template name="components">
	<view>
		<view class="headerHei cu-bar bg-cyan">
			<view></view>
			<view class="content"></view>
			<view class="action" style="margin-top: 15px;">
				<navigator :url="'/pages/component/setting'"><text class="cuIcon-settings" style="font-size: 21px;"></text></navigator>
			</view>
		</view>
		<view class="box getheight">
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					开始时间:
					<ruiDatePicker fields="day" class="ruidata" start="2010-00-00" end="2030-12-30" :value="start" @change="bindChange1"></ruiDatePicker>
				</view>
				<view class="action">
					结束时间:
					<ruiDatePicker fields="day" class="ruidata" start="2010-00-00" end="2030-12-30" :value="end" @change="bindChange2"></ruiDatePicker>
				</view>
			</view>
		</view>
		<scroll-view class="page" :style="{ height: pageHeight + 'px' }">
			<view style="margin-left: 10px;margin-right: 10px;" class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-title text-orange "></text>
					巡检计划
				</view>
				<view class="action">
					<view class="title">是否完成：</view>
					<switch class="blue" @change="SwitchB" :class="switchB ? 'checked' : ''" :checked="switchB ? true : false" color="#e54d42"></switch>
				</view>
			</view>
			<view style="margin-left: 10px;margin-right: 10px;" class="cu-list bg-white">
				<navigator
					style="width: 100%;"
					hover-class="none"
					:url="'/pages/component/polling?id=' + item.id"
					navigateTo
					class="cu-item"
					v-for="(item, index) in elements"
					:key="index"
				>
					<view class="text-grey padding-xs">公司: A项目组</view>
					<view style="width: 100%;" class="flex p-xs margin-bottom-sm mb-sm text-center">
						<view class="flex-sub text-sl ">
							<text class=" cuIcon-roundcheckfill text-green"><text class="text-grey text-sm">巡检</text></text>
						</view>
						<view class="flex-sub text-sl ">
							<text class=" cuIcon-warnfill text-red"><text class="text-grey text-sm">整改</text></text>
						</view>
						<view class="flex-sub text-sl ">
							<text class=" cuIcon-infofill text-grey"><text class="text-grey text-sm">完成</text></text>
						</view>
					</view>
					<view style="width: 100%;" class="flex p-xs margin-bottom-sm mb-sm text-center">
						<view class="flex-sub solid-bottom text-gray text-sm">
							<text class="cuIcon-remind margin-lr-xs"></text>
							10-10/10-11
						</view>
						<view class="flex-sub solid-bottom text-gray text-sm">
							<text class="cuIcon-remind margin-lr-xs"></text>
							2020-10-10
						</view>
						<view class="flex-sub solid-bottom text-gray text-sm">
							<text class="cuIcon-remind margin-lr-xs"></text>
							2020-10-10
						</view>
					</view>
					<!-- <view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>
						<view class="content">
							<view class="text-grey">公司:A项目组</view>
							<view class="text-gray text-sm flex">
								<view class="text-cut">
									<text class="cuIcon-infofill text-red  margin-right-xs"></text>
									项目：施工安全
								</view>
							</view>
						</view>
						<view class="action">
							<view class="text-grey text-xs">2020-10-28</view>
							<view class="cu-tag round bg-grey sm">5</view>
						</view> -->
				</navigator>
			</view>
		</scroll-view>
		<text v-if="isShow" class="loading-text">
			{{ loadingType === 0 ? contentText.contentdown : loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore }}
		</text>
	</view>
</template>

<script>
import service from '@/service.js';
import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
import basic from '@/api/basic';
var _self,
	page = 1;
export default {
	components: { ruiDatePicker },
	data() {
		return {
			start: '',
			end: '',
			switchB: true,
			loadingType: 0,
			pageHeight: 0,
			contentText: {
				contentdown: '上拉显示更多',
				contentrefresh: '正在加载...',
				contentnomore: '没有更多数据了'
			},
			isShow: true,
			elements: [
				{
					title: '采购管理',
					name: 'procurement',
					color: 'purple',
					cuIcon: 'vipcard'
				},
				{
					title: '销售管理',
					name: 'sales',
					color: 'mauve',
					cuIcon: 'formfill'
				}
			]
		};
	},
	created() {
		_self = this;
		/* if (service.getUsers().length > 0) {
			if (service.getUsers()[0].account != '' && service.getUsers()[0].account != 'undefined') {
				 basic
					.getSysMenuById(-1)
					.then(rest => {
						this.elements = rest.data;
					})
					.catch(errt => {
						uni.showToast({
							icon: 'none',
							title: errt.msg
						});
					}); 
			} else { 
				return uni.reLaunch({
					url: '../login/login'
				});
			}
		} else {
			return uni.reLaunch({
				url: '../login/login'
			});
		} */
		var me = this;
		uni.getSystemInfo({
			success: function(res) {
				// res - 各种参数
				let info = uni.createSelectorQuery().select('.getheight');
				let customHead = uni.createSelectorQuery().select('.headerHei');
				var infoHeight = 0;
				var headHeight = 0;
				info.boundingClientRect(function(data) {
					//data - 各种参数
					infoHeight = data.height;
				}).exec();
				customHead
					.boundingClientRect(function(data) {
						//data - 各种参数
						headHeight = data.height;
					})
					.exec();
				setTimeout(function() {
					me.pageHeight = res.windowHeight - infoHeight - headHeight - 90;
				}, 1000);
			}
		});
		this.start = this.getDay('', -3).date;
		this.end = this.getDay('', 0).date;
		me.getLists()
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.getLists();
	},
	// 上拉加载
	onReachBottom: function() {
		this.isShow = false;
		page++; //每触底一次 page +1
		// console.log(_self.cuIconList.length);
		if (_self.loadingType != 0) {
			//loadingType!=0;直接返回
			return false;
		}
		_self.loadingType = 1;
		// console.log(page);
		uni.showNavigationBarLoading(); //显示加载动画
		let obj = this.qFilter();
		obj.pageNum = page;
		basic
			.pollingPlanList(obj)
			.then(res => {
				if (res.success) {
					if (_self.cuIconList.length == res.data.total) {
						//没有数据
						_self.loadingType = 2;
						uni.hideNavigationBarLoading(); //关闭加载动画
						return false;
					}
					if (res.data.list.length > 0) {
						let dList = res.data.list;
						dList.forEach((item, index) => {
							_self.cuIconList.push(item);
						});
					}
					/* for (var i = _self.cuIconList.length; i < res.data.total; i++) {
						_self.cuIconList = _self.cuIconList.concat(res.data.list[i - 1]); //将数据拼接在一起
					} */
					_self.loadingType = 0; //将loadingType归0重置
					uni.hideNavigationBarLoading(); //关闭加载动画
					uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
					this.isShow = true;
				}
			})
			.catch(err => {
				uni.showToast({
					icon: 'none',
					title: err.msg
				});
			});
	},
	methods: {
		//列表数据
		getLists: function() {
			//第一次回去数据
			_self.loadingType = 0;
			uni.showNavigationBarLoading();
			const me = this;
			basic
				.pollingPlanList(this.qFilter())
				.then(res => {
					if (res.success) {
						console.log(res);
						_self.cuIconList = res.data.list;
						uni.hideNavigationBarLoading();
						uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
		},
		// 查询前后三天日期
		getDay(date, day) {
			var today = new Date();
			var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
			today.setTime(targetday_milliseconds); //注意，这行是关键代码
			var tYear = today.getFullYear();
			var tMonth = today.getMonth();
			var tDate = today.getDate();
			var getDay = today.getDay();
			tMonth = this.doHandleMonth(tMonth + 1);
			tDate = this.doHandleMonth(tDate);
			var weeks = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
			var week = weeks[getDay];
			return {
				day: tDate,
				week: week,
				date: tYear + '-' + tMonth + '-' + tDate
			};
		},
		SwitchB(e) {
			this.switchB = e.detail.value;
		},
		bindChange1(e) {
			this.start = e;
		},
		bindChange2(e) {
			this.end = e;
		},
		doHandleMonth(month) {
			var m = month;
			if (month.toString().length == 1) {
				m = '0' + month;
			}
			return m;
		},
		// 查询条件过滤
		qFilter() {
			let obj = {};
			this.start != null && this.start != undefined ? (obj.startDate = this.start) : null;
			this.end != null && this.end != undefined ? (obj.endDate = this.end) : null;
			obj.pageSize = 20;
			obj.pageNum = 1;
			return obj;
		},
		search() {
			const me = this;
			if (this.start.length > 5 && this.end.length > 5) {
				if (!this.compareDate(this.start, this.end)) {
					me.getLists();
				} else {
					uni.showToast({
						icon: 'none',
						title: '结束日期不能大于开始日期'
					});
					return;
				}
			} else {
				uni.showToast({
					icon: 'none',
					title: '日期格式错误'
				});
				return;
			}
		}
	}
};
</script>

<style>
.action {
	font-size: 13px !important;
}
.ruidata {
	font-size: 13px;
	height: 7vw !important;
}
.box {
	width: 100%;
}
.cu-bar {
	min-height: 30px;
}
.nav-title::first-letter {
	font-size: 16px;
	margin-right: 2px;
}
.cu-list.menu-avatar > .cu-item .action {
	width: 64px;
	text-align: right;
}

.nav-list {
	margin-top: 5%;
}
.cu-bar {
	height: 50px;
}
.nav-title::first-letter {
	font-size: 16px;
	margin-right: 2px;
}
.loading-text {
	height: 80upx;
	line-height: 80upx;
	font-size: 30upx;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
}
</style>
