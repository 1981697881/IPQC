<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">巡检计划</block>
		</cu-custom>
		<view class="box getheight">
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					被检公司:
					<text>{{ form.deptName }}</text>
				</view>
				<view class="action">
					单号:
					<text>{{ form.checkNo }}</text>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					登记日期:
					<text>{{ form.recordDate }}</text>
				</view>
				<view class="action">
					计划状态:
					<text>{{ form.auditStatus }}</text>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					被检项目:
					<view v-for="(item, index) in form.recordCheckList"
					:key="index">
						<text class="cuIcon-text text-blue margin-right-xs"></text>{{index+1}} {{item.checkName}}</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" style="z-index: 333" :class="modalName == 'Modal' ? 'show' : ''">
			<view class="cu-dialog bg-white" style="height: 480upx;">
				<view class="cu-bar justify-end margin-lr-xs" style="height: 70upx;border-bottom: 1px solid #CCCCCC;">
					<view class="content text-sl">检查登记</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="cu-bar margin-top solid-bottom" style="height: 60upx;">
					<view class="action">
						<view style="width: 70px;">检查项目:</view>
						<ld-select
							:multiple="true"
							:list="projectCheckList"
							list-key="checkName"
							value-key="checkId"
							placeholder="请选择"
							clearable
							v-model="winForm.checkId"
							@change="checkListChange"
						></ld-select>
					</view>
				</view>
				<view class="cu-bar solid-bottom" style="height: 60upx;">
					<view class="action">
						<view style="width: 70px;">被检人员</view>
						<ld-select
							:list="userList"
							list-key="username"
							value-key="uid"
							placeholder="请选择"
							clearable
							v-model="winForm.checkStaff"
							@change="userListChange"
						></ld-select>
					</view>
				</view>
				<view class="cu-bar solid-bottom" style="height: 60upx;">
					<view class="action">
						<view style="width: 70px;">检查日期:</view>
						<picker mode="date" :value="winForm.recordDate" start="2020-09-01" end="2040-09-01" @change="DateChange">
							<view class="picker">{{ winForm.recordDate }}</view>
						</picker>
					</view>
				</view>
				<view class="cu-bar solid-bottom" style="height: 60upx;">
					<view class="action">
						<view style="width: 70px;">陪同人员:</view>
						<input name="input" style="font-size: 13px;text-align: left;" v-model="winForm.escort" />
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
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<!-- <view class="bg-white evan-step-show__title text-center"><text class="evan-step-show__title__item"></text></view>
			<evan-steps :active="1" class="bg-white" style="padding-left: 30%;">
				<navigator
					hover-class="none"
					:url="'/pages/' + item.path"
					navigateTo
					:style="[{ animation: 'show ' + ((index + 1) * 0.2 + 1) + 's 1' }]"
					v-for="(item, index) in elements"
					:key="index"
				>
				<evan-step :icon="item.icon"  :status="item.status" :title="item.title" :description="item.description"></evan-step>
				<evan-step title="延期申请" description="2020-10-10 10:10:10">
					<template v-slot:icon>
						<image class="evan-step-show__show" src="/static/logo.png"></image>
					</template>
				</evan-step>
				</navigator>
			</evan-steps> -->
			<view class="cu-tabbar-height"></view>
		<view class="cu-bar tabbar shadow foot">
			<view class="box text-center">
				<button class="cu-btn bg-green shadow-blur round lg" style="width: 40%;" @tap="$manyCk(alterData)">修改</button>
			</view>
		</view>
		</scroll-view>
	</view>
</template>
<script>
import basic from '@/api/basic';
import EvanSteps from '@/components/evan-steps/evan-steps.vue';
import EvanStep from '@/components/evan-steps/evan-step.vue';
import UniIcons from '@/components/uni-icons/uni-icons.vue';
import ldSelect from '@/components/ld-select/ld-select.vue';
export default {
	components: {
		EvanSteps,
		EvanStep,
		ldSelect,
		UniIcons
	},
	data() {
		return {
			form: {
				deptName: ''
			},
			winForm: {
				checkStaff: '',
				checkId: [],
				recordDate: null,
				escort: '',
			},
			modalName: null,
			pageHeight: 0,
			cuIList: [],
			userList: [],
			projectCheckList: [],
			elements: [
				{
					title: '打卡',
					status: '',
					path: 'ClockIn/ClockIn',
					icon: 'location',
					description: '2020-10-10 12:20:30'
				},
				{
					title: '巡检登记',
					icon: '',
					status: 'error',
					path: 'component/details/inspection',
					description: '2020-10-10 12:20:30'
				},
				{
					title: '整改登记',
					icon: '',
					status: '',
					path: 'component/details/abarbeitung',
					description: '2020-10-10 12:20:30'
				},
				{
					title: '整改反馈',
					icon: '',
					status: '',
					path: 'component/details/feedback',
					description: '2020-10-10 12:20:30'
				},
				/* {
					title: '延期申请',
					icon: '',
					status: '',
					path: 'component/details/applyFor',
					description: '2020-10-10 12:20:30'
				}, */
				{
					title: '完成',
					icon: '',
					status: '',
					path: 'component/details/complete',
					description: '2020-10-10 12:20:30'
				}
			]
		};
	},
	onReady: function() {
		var me = this;
		
		uni.getSystemInfo({
			success: function(res) {
				// res - 各种参数
				let info = uni.createSelectorQuery().select('.getheight');
				let customHead = uni.createSelectorQuery().select('.customHead');
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
					me.pageHeight = res.windowHeight - infoHeight - headHeight;
				}, 1000);
			}
		});
	},
	onLoad: function(option) {
		let me = this;
		if (JSON.stringify(option) != '{}') {
			me.winForm.planId = option.planId
			me.form.planId = option.planId
			basic
				.pollingRecordByPlanId(option.planId)
				.then(res => {
					if (res.flag) {
						if (res.data == null) {
							me.modalName = 'Modal';
						}
						me.form = res.data
						me.form.deptName = option.deptName
						console.log(me.form)
						console.log(123)
						uni.showToast({
							icon: 'success',
							title: err.msg
						});
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
		}
		me.initMain();
		this.winForm.recordDate = this.getDay('', 0).date;
	},
	methods: {
		alterData(){
			this.modalName = 'Modal';
			let checkList = this.form.recordCheckList
			let check = []
			checkList.forEach((item,index)=>{
				check.push(item.checkId)
			})
			this.winForm.checkStaff = this.form.checkStaff
			this.winForm.checkId = check
			this.winForm.recordDate = this.form.recordDate
			this.winForm.escort = this.form.escort
			this.winForm.planId = this.form.planId
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
		saveCom() {
			var me = this;
			if (this.winForm.checkStaff == '' || typeof this.winForm.checkStaff == 'undefined') {
				return uni.showToast({
					icon: 'none',
					title: '请选择人员！'
				});
			}
			if (this.winForm.checkId.length <= 0) {
				return uni.showToast({
					icon: 'none',
					title: '请选择检查项目！'
				});
			}
			let rqData = {}
			let recordCheckList = []
			let checkList = me.winForm.checkId
			checkList.forEach((item,index)=>{
				let obj = {}
				obj.checkId = item
				obj.qualifiedStatus = 0
				recordCheckList.push(obj)
			})
			rqData.planId = me.winForm.planId
			rqData.recordCheckList = recordCheckList
			me.winForm.checkStaff != null && me.winForm.checkStaff != '' ? rqData.checkStaff = me.winForm.checkStaff : null
			me.winForm.recordDate != null && me.winForm.recordDate != '' ? rqData.recordDate = me.winForm.recordDate : null
			me.winForm.escort != null && me.winForm.escort != '' ? rqData.escort = me.winForm.escort : null
			basic.pollingRecordAdd(rqData).then(reso => {
				if (reso.flag) {
					uni.showToast({
						icon: 'success',
						title: reso.msg
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: reso.msg
					});
				}
			});
		},
		hideModal(e) {
			this.modalName = null;
		},
		initMain() {
			var me = this;
			basic
				.userList()
				.then(res => {
					if (res.flag) {
						me.userList = res.data;
						me.userList.forEach((item,index) =>{
							item.uid = item.uid.toString()
						})
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
			basic
				.projectCheckList()
				.then(res => {
					if (res.flag) {
						me.projectCheckList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
		},
		checkListChange(val) {
			this.winForm.recordCheckList = val;
		},
		userListChange(val) {
			this.winForm.checkStaff = val;
		},
		DateChange(e) {
			this.date = e.detail.value;
		}
	}
};
</script>
<style>
.page {
	height: 100vh;
}
.nav-list {
	margin-top: 5%;
}
.nav-title::first-letter {
	font-size: 16px;
	margin-right: 2px;
}
</style>
<style>
.main {
	font-size: 32rpx;
	padding: 20rpx;
}
.cu-item {
	float: left;
	width: 50%;
}
.cu-item .content {
	float: left;
}
.cu-list.menu-avatar > .cu-item .content {
	left: 5px;
}
.cu-list.menu-avatar > .cu-item .action {
}
.input {
	height: 30px;
}
.box {
	width: 100%;
}
.uni-input-placeholder,
.uni-input-input {
	font-size: 13px;
}
.action,
.content {
	font-size: 13px !important;
}
.ruidata {
	font-size: 13px;
	height: 7vw !important;
}
.cu-bar {
	min-height: 30px;
}
/* .page {
		height: calc(100vh - 320upx);
	} */
.nav-title::first-letter {
	font-size: 16px;
	margin-right: 2px;
}
</style>
<style lang="scss" scoped>
/* #ifdef APP-PLUS*/
.selectTrees {
	margin-bottom: 180rpx;
}
/* #endif */

.deleteBtn {
	position: absolute;
	right: 10%;
	background: #f97979;
	padding: 2rpx 16rpx;
	border-radius: 4rpx;
}

.itemT:nth-child(odd) {
	margin-left: 60rpx;
	color: #666666;
	width: 45% !important;
}
.itemT:nth-child(even) {
	color: #666666;
	width: 40% !important;
}
.itemO {
	color: #666666;
	width: 50% !important;
}

.tree-two {
	padding: 20rpx;
	color: #666666;
	border-bottom: 2rpx solid #e2e2e2;
}
.flexIn {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	align-content: center;
	flex-wrap: nowrap;
	width: 100%;
}
</style>
<style lang="scss" scoped>
.evan-step-show {
	padding: 20px;
	&__title {
		padding: 10px 0;
		&__item {
			font-size: 16px;
			color: #333;
			font-weight: bold;
		}
	}
	&__show {
		width: 22px;
		height: 22px;
		display: block;
	}
}
</style>
