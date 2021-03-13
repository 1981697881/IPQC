<template name="components">
	<view class="tier">
		<view class="headerHei cu-bar bg-cyan">
			<view></view>
			<view class="content"></view>
			<view class="action" style="margin-top: 15px;">
				<navigator :url="'/pages/component/setting'"><text class="cuIcon-settings" style="font-size: 21px;"></text></navigator>
			</view>
		</view>
		<view class="cu-modal" style="z-index: 333" :class="modalName == 'Modal' ? 'show' : ''">
			<view class="cu-dialog bg-white" style="height: 360upx;">
				<view class="cu-bar justify-end margin-lr-xs" style="height: 70upx;border-bottom: 1px solid #CCCCCC;">
					<view class="content text-sl">新建巡检</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="cu-bar margin-top solid-bottom" style="height: 60upx;">
					<view class="action">
						<view style="width: 70px;">检查项目:</view>
						<ld-select
							:list="projectType"
							list-key="typeName"
							value-key="typeId"
							placeholder="请选择"
							clearable
							ref="projectCheck"
							v-model="winForm.typeId"
							@change="checkListChange"
						></ld-select>
					</view>
				</view>
				<view class="cu-bar solid-bottom" style="height: 60upx;">
					<view class="action">
						<view style="width: 70px;">检查日期:</view>
						<picker mode="date" :value="winForm.planTime" start="2020-09-01" end="2040-09-01" @change="DateChange">
							<view class="picker">{{ winForm.planTime }}</view>
						</picker>
					</view>
				</view>
				<view style="clear: both;" class="cu-bar bg-white justify-end padding-bottom-xl">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="$manyCk(saveCom)">确定</button>
					</view>
				</view>
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
					<switch class="blue" @change="SwitchB" :class="onSwitch ? 'checked' : ''" :checked="onSwitch ? true : false" color="#e54d42"></switch>
				</view>
			</view>
			<scroll-view :style="{ height: pageHeight + 'px' }" scroll-x class="page">
				<view style="margin-left: 10px;margin-right: 10px;overflow-y: auto;height: 100%;" class=" cu-list bg-white ">
					<view style="width: 100%;" class="cu-item" v-for="(item, index) in elements" :key="index" @tap="$manyCk(showList(index, item))">
						<view
							:class="
								item.riskLevel != null && item.riskLevel == '0'
									? 'text-blue'
									: item.riskLevel == '1'
									? 'text-yellow'
									: item.riskLevel == '2'
									? 'text-orange'
									: item.riskLevel == '3'
									? 'text-red'
									: 'text-grey'
							"
							class="cu-bar bg-white"
							style="height: 25px;min-height: 25px;"
						>
							<view class="action" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">公司: {{ item.deptName }}</view>
							<view class="action">单号: {{ item.planNo }}</view>
						</view>
						<view
							:class="
								item.riskLevel != null && item.riskLevel == '0'
									? 'text-blue'
									: item.riskLevel == '1'
									? 'text-yellow'
									: item.riskLevel == '2'
									? 'text-orange'
									: item.riskLevel == '3'
									? 'text-red'
									: 'text-grey'
							"
							class="cu-bar bg-white"
							style="height: 25px;min-height: 25px"
						>
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
			<view class="cu-bar search bg-white">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input :adjust-position="false" v-model="keyword" type="text" placeholder="编号,名称" confirm-type="search" />
				</view>
				<view class="action"><button class="cu-btn bg-green shadow-blur round" @tap="searchKey">搜索</button></view>
			</view>
			<scroll-view :style="{ height: pageHeight2 + 'px' }" class="scroll-box" scroll-y enable-back-to-top scroll-with-animation @scrolltolower="loadMore">
				<view>
					<view v-for="(item, index) in cuIconList" :key="index">
						<view class="cu-list menu-avatar">
							<view class="cu-item" style="width: 100%;margin-top: 2px;height: 220upx;">
								<view style="clear: both;width: 100%;" class="grid text-left col-2" @tap="addPlan(index, item)" data-target="Modal" data-number="item.number">
									<view class="text-grey">项目编号:{{ item.proCode }}</view>
									<view class="text-grey" style="width: 100%;">项目名称:{{ item.proName }}</view>
									<view class="text-grey">负责人:{{ item.principal }}</view>
									<view class="text-grey">联系电话:{{ item.tel }}</view>
									<view class="text-grey" style="width: 100%;">所属公司:{{ item.deptName }}</view>
									<view class="text-grey" style="width: 100%;">详细地址:{{ item.address }}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 加载更多 -->
				<view v-if="cuIconList.length" class="cu-load text-gray" :class="loadStatus"></view>
			</scroll-view>
		</block>
	</view>
</template>
<script>
import service from '@/service.js';
import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
import basic from '@/api/basic';
import EvanSteps from '@/components/evan-steps/evan-steps.vue';
import EvanStep from '@/components/evan-steps/evan-step.vue';
export default {
	components: { ruiDatePicker, EvanSteps, EvanStep },
	data() {
		return {
			TabCur: 0,
			start: '',
			end: '',
			onSwitch: false,
			pageHeight: 0,
			pageHeight2: 0,
			modalName: null,
			loadStatus: 'over', //loading,over
			winForm: {
				planTime: '',
				typeId: ''
			},
			listParams: {
				pageSize: 100,
				pageNum: 1
			},
			keyword: '',
			isShow: true,
			lastPage: 1,
			elements: [],
			projectType: [],
			cuIconList: []
		};
	},
	created() {
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
					me.pageHeight = res.windowHeight - 190;
					me.pageHeight2 = res.windowHeight - 88 - 50;
				}, 1000);
			}
		});
		me.start = me.getDay('', -3).date;
		me.end = me.getDay('', 0).date;
		if (service.getUsers().length > 0) {
			if (service.getUsers()[0].username != '' && service.getUsers()[0].username != 'undefined') {
				me.initMain();
				me.getLists();
				me.getProjects(me.keyword);
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
	// 触底加载更多
	onReachBottom() {
		console.log(123);
		if (this.listParams.pageNum < this.lastPage) {
			this.listParams.pageNum += 1;
			this.getProjects();
		}
	},
	methods: {
		loadMore() {
		console.log(123);
		if (this.listParams.pageNum < this.lastPage) {
			this.listParams.pageNum += 1;
			this.getProjects();
		}
	},
		saveCom() {
			var me = this;
			if (me.winForm.typeId == '' || typeof this.winForm.typeId == 'undefined') {
				return uni.showToast({
					icon: 'none',
					title: '请选择类别！'
				});
			}
			if (me.winForm.planTime == '' || typeof this.winForm.planTime == 'undefined') {
				return uni.showToast({
					icon: 'none',
					title: '请选择日期！'
				});
			}
			basic
				.addPollingPlan(me.winForm)
				.then(res => {
					if (res.flag) {
						basic
							.pollingRecordByPlanId(res.data.planId)
							.then(reso => {
								if (reso.flag) {
									me.modalName = null;
									me.getLists();
									console.log(reso.data == null);
									if (reso.data == null) {
										uni.navigateTo({
											url: '/pages/component/polling?planId=' + res.data.planId + '&deptName=' + me.winForm.deptName+ '&inspector=' + res.data.inspector
										});
									} else {
										uni.navigateTo({
											url:
												'/pages/component/polling?planId=' +
												res.data.planId +
												'&deptName=' +
												me.winForm.deptName +
												'&checkStaff=' +
												reso.data.checkStaff +
												'&inspector=' +
												res.data.inspector +
												'&recordCheckList=' +
												encodeURIComponent(JSON.stringify(reso.data.recordCheckList))
										});
									}
								}
							})
							.catch(erro => {
								uni.showToast({
									icon: 'none',
									title: erro.msg
								});
							});
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
					me.isClick = false;
				});
		},
		checkListChange(val) {
			this.winForm.typeId = val;
		},
		DateChange(e) {
			this.winForm.planTime = e.detail.value;
		},
		initMain() {
			const me = this;
			basic
				.projectTypeList()
				.then(res => {
					if (res.flag) {
						res.data.forEach(item => {
							item.typeId = item.typeId.toString();
						});
						me.$set(me, 'projectType', res.data);
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
		},
		addPlan(index, item) {
			this.$nextTick(() => {
				this.$refs.projectCheck.empty();
			});
			this.winForm = {
				planTime: this.getDay('', 0).date,
				typeId: '',
				proId: item.proId,
				address: item.address,
				deptId: item.deptId,
				username: service.getUsers()[0].username,
				deptName: item.deptName
			};
			this.modalName = 'Modal';
		},
		hideModal(e) {
			this.modalName = null;
		},
		tabSelect(e) {
			this.keyword = '';
			this.TabCur = e.currentTarget.dataset.id;
		},
		showList(index, item) {
			basic
				.pollingRecordByPlanId(item.planId)
				.then(res => {
					if (res.flag) {
						console.log(item.inspector);
						if (res.data == null) {
							uni.navigateTo({
								url: '/pages/component/polling?planId=' + item.planId + '&deptName=' + item.deptName+ '&inspector=' + item.inspector
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
			const me = this;
			basic
				.pollingPlanList(this.qFilter())
				.then(res => {
					console.log(res);
					if (res.flag) {
						me.elements = res.data.records;
					}
				})
				.catch(res => {
					uni.showToast({
						icon: 'none',
						title: res.msg
					});
				});
		},
		searchKey() {
			this.cuIconList= []
			this.listParams.pageNum = 1;
			this.getProjects(this.keyword);
		},
		getProjects(val) {
			let me = this;
			me.loadStatus = 'loading';
			basic
				.projectList(this.listParams, { keyword: val })
				.then(res => {
					if (res.flag) {
						me.cuIconList = [...me.cuIconList, ...res.data.records];
						me.lastPage = res.data.pages;
						if (me.listParams.pageNum < res.data.pages) {
							me.loadStatus = '';
						} else {
							me.loadStatus = 'over';
						}
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
			this.onSwitch = e.detail.value;
			this.search();
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
			obj.pageSize = 100;
			(obj.username = service.getUsers()[0].username), (obj.isornot = this.onSwitch.toString());
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
