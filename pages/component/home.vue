<template name="components">
	<view class="tier">
		<view class="headerHei cu-bar bg-cyan">
			<view></view>
			<view class="content"></view>
			<view class="action" style="margin-top: 15px;">
				<navigator :url="'/pages/component/setting'"><text class="cuIcon-settings" style="font-size: 21px;"></text></navigator>
			</view>
		</view>
		<view class="bg-green nav text-center">
			<view class="cu-item" :class="0 == TabCur ? 'text-white cur' : ''" @tap="tabSelect" data-id="0">
				<text class="cuIcon-camerafill"></text>
				巡检计划
			</view>
			<view class="cu-item" :class="1 == TabCur ? 'text-white cur' : ''" @tap="tabSelect" data-id="1">
				<text class="cuIcon-upstagefill"></text>
				检查项目
			</view>
		</view>
		<block v-if="TabCur == 0">
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
			<scroll-view :style="{ height: pageHeight + 'px' }" scroll-x class="page">
				<view style="margin-left: 10px;margin-right: 10px;" class="cu-list bg-white">
					<view style="width: 100%;" class="cu-item" v-for="(item, index) in elements" :key="index" @tap="$manyCk(showList(index, item))">
						<view class="text-grey cu-bar bg-white" style="height: 25px;min-height: 25px;">
							<view class="action" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">公司: {{ item.deptName }}</view>
							<view class="action">单号: {{ item.planNo }}</view>
						</view>
						<view class="text-grey cu-bar bg-white" style="height: 25px;min-height: 25px">
							<view class="action" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">项目: {{ item.proName }}</view>
							<view class="action">检查人员: {{ item.inspector }}</view>
						</view>
						<!-- <view style="width: 100%;" class="flex p-xs margin-bottom-sm mb-sm text-center">
								<view class="flex-sub text-xl ">
									<text :class="'cuIcon-roundcheckfill text-green'"><text class="text-grey text-sm">巡检</text></text>
								</view>
								<view class="flex-sub text-xl ">
									<text :class="'cuIcon-timefill text-grey'"><text class="text-grey text-sm">整改</text></text>
								</view>
								<view class="flex-sub text-xl ">
									<text :class="'cuIcon-timefill text-grey'"><text class="text-grey text-sm">完成</text></text>
								</view>
							</view> -->
						<evan-steps class="solid-bottom" :active="item.status == '结束' ? 2 : item.status == '整改待检查' ? 1 : 0" direction="horizontal" primaryColor="green">
							<evan-step title="巡检"></evan-step>
							<evan-step title="整改"></evan-step>
							<evan-step title="完成"></evan-step>
						</evan-steps>
						<!-- <view style="width: 100%;" class="flex p-xs margin-bottom-sm mb-sm text-center">
								<view class="flex-sub solid-bottom text-gray text-sm">
									<text class="cuIcon-remind margin-lr-xs"></text>
									{{item.planTime}}
								</view>
								<view class="flex-sub solid-bottom text-gray text-sm">
									<text class="cuIcon-remind margin-lr-xs"></text>
									----/--/--
								</view>
								<view class="flex-sub solid-bottom text-gray text-sm">
									<text class="cuIcon-remind margin-lr-xs"></text>
									----/--/--
								</view>
							</view> -->
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
					</view>
				</view>
			</scroll-view>
		</block> 
		<block v-if="TabCur == 1">
			<scroll-view class="page" :style="{ height: pageHeight + 'px' }"></scroll-view>
		</block>
		<!-- <text v-if="isShow" class="loading-text">
			{{ loadingType === 0 ? contentText.contentdown : loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore }}
		</text> -->
	</view>
</template>
<script>
import service from '@/service.js';
import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
import basic from '@/api/basic';
import EvanSteps from '@/components/evan-steps/evan-steps.vue';
import EvanStep from '@/components/evan-steps/evan-step.vue';
var _self,
	page = 1;
export default {
	components: { ruiDatePicker, EvanSteps, EvanStep },
	data() {
		return {
			TabCur: 0,
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
			elements: []
		};
	},
	created() {
		_self = this;
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
					console.log(res.windowHeight +','+ infoHeight +','+ headHeight)
					me.pageHeight = res.windowHeight - infoHeight - headHeight -38;
					console.log(me.pageHeight)
				}, 1000);
			}
		});
		me.start = me.getDay('', -3).date;
		me.end = me.getDay('', 0).date;
		if (service.getUsers().length > 0) {
			if (service.getUsers()[0].username != '' && service.getUsers()[0].username != 'undefined') {
				me.getLists();
			} else {
				return uni.reLaunch({
					url: '../login/login'
				});
			}
		} else {
			return uni.reLaunch({
				url: '../login/login'
			});
		}
	},
	onShow() {
		var me = this;
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
				if (res.flag) {
					if (_self.cuIconList.length == res.data.total) {
						//没有数据
						_self.loadingType = 2;
						uni.hideNavigationBarLoading(); //关闭加载动画
						return false;
					}
					if (res.data.records.length > 0) {
						let dList = res.data.records;
						dList.forEach((item, index) => {
							_self.elements.push(item);
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
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
		},
		showList(index, item) {
			basic
				.pollingRecordByPlanId(item.planId)
				.then(res => {
					if (res.flag) {
						console.log(res.data == null);
						if (res.data == null) {
							uni.navigateTo({
								url: '/pages/component/polling?planId=' + item.planId + '&deptName=' + item.deptName
							});
						} else {
							uni.navigateTo({
								url:
									'/pages/component/polling?planId=' +
									item.planId +
									'&deptName=' +
									item.deptName +
									'&checkStaff=' +
									res.data.checkStaff +
									'&recordCheckList=' +
									encodeURIComponent(JSON.stringify(res.data.recordCheckList))
							});
						}
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
		},
		//列表数据
		getLists: function() {
			//第一次回去数据
			_self.loadingType = 0;
			uni.showNavigationBarLoading();
			const me = this;
			basic
				.pollingPlanList(this.qFilter())
				.then(res => {
					console.log(res);
					if (res.flag) {
						_self.elements = res.data.records;
						uni.hideNavigationBarLoading();
						uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
					}
				})
				.catch(res => {
					uni.showToast({
						icon: 'none',
						title: res.msg
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
		doHandleMonth(month) {
			var m = month;
			if (month.toString().length == 1) {
				m = '0' + month;
			}
			return m;
		},
		SwitchB(e) {
			this.switchB = e.detail.value;
		},
		bindChange1(e) {
			this.start = e;
			this.search();
		},
		bindChange2(e) {
			this.end = e;
			this.search();
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
		compareDate(date1, date2) {
			var oDate1 = new Date(date1);
			var oDate2 = new Date(date2);
			if (oDate1.getTime() > oDate2.getTime()) {
				return true; //第一个大
			} else {
				return false; //第二个大
			}
		},
		search() {
			const me = this;
			if (me.start.length > 5 && me.end.length > 5) {
				if (!me.compareDate(me.start, me.end)) {
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
	 .tier {
	        width: 100%;
	        height: 100%;
	    }
	    .tier::-webkit-scrollbar {
	        display: none;
	    }

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
