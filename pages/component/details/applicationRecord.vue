<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">整改历史</block>
			<block slot="right" v-if="!isCommit"><text @tap="$manyCk(handleAdd)" class="cuIcon-add margin-right-xs">新增</text></block>
		</cu-custom>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<view v-for="(item, index) in cuIconList" :key="index">
				<view class="cu-list menu-avatar">
					<view class="cu-item" style="width: 100%;margin-top: 2px;height: 200upx;">
						<view style="clear: both; width: 100%;" class="grid text-left col-2" @tap="showList(index, item)" data-target="Modal">
							<view class="text-grey">检查时间:{{ item.checkTime }}</view>
							<view class="text-grey">打卡人:{{ item.clockName }}</view>
							<view class="text-grey">被检人:{{ item.clockName }}</view>
							<view class="text-grey">检查人员:{{ item.escortName }}</view>
							<view class="text-grey">申请人:{{ item.proposer }}</view>
							<view class="text-grey">批准人:{{ item.ratify }}</view>
							<view class="text-grey" style="width: 100%;">打卡时间:{{ item.clockTime }}</view>
							<view class="text-grey" style="width: 100%;">延期原因:{{ item.delayReason }}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
import basic from '@/api/basic';
export default {
	components: { ruiDatePicker },
	data() {
		return {
			isShow: true,
			isCommit: false,
			start: '',
			end: '',
			keyword: '',
			onoff: true,
			pageHeight: 0,
			cuIconList: []
		};
	},
	onShow: function(option) {
		uni.$on('handleBack', res => {
			this.recordId = res.recordId;
			this.planId = res.planId;
			this.isType = res.isType;
			this.deptName = res.deptName;
			this.getNewsList();
			// 清除监听
			uni.$off('handleBack');
		});
	},
	onLoad: function(option) {
		// 列表数据默认加载
		if (JSON.stringify(option) != '{}') {
			if(option.isCommit == 'true'){
				this.isCommit=true
			}else{
				this.isCommit=false
			}
			this.recordId = option.recordId;
			this.planId = option.planId;
			this.isType = option.isType;
			this.deptName = option.deptName;
			this.getNewsList();
		}
	},
	onReady: function() {
		var me = this;
		uni.getSystemInfo({
			success: function(res) {
				// res - 各种参数
				let customHead = uni.createSelectorQuery().select('.customHead');
				var headHeight = 0;
				customHead
					.boundingClientRect(function(data) {
						//data - 各种参数
						headHeight = data.height;
					})
					.exec();
				setTimeout(function() {
					me.pageHeight = res.windowHeight - headHeight;
				}, 1000);
			}
		});
	},
	methods: {
		// 产品列表数据
		getNewsList: function() {
			//第一次回去数据
			const me = this;
			basic
				.recordRectifyList(this.qFilter())
				.then(res => {
					if (res.flag) {
						me.cuIconList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
		},
		handleAdd(){
			uni.navigateTo({
				url: '../../ClockIn/ClockIn?planId=' +
					this.planId +
					'&isOrder=true' +
					'&deptName=' +
					this.deptName +
					'&recordId=' +
					this.recordId +
					'&isType=' +
					this.isType
			}); 
		},
		showList(index, item) {
			uni.navigateTo({
				url:
					'../details/feedback?recordId=' +
					item.recordId +
					'&planId=' +
					this.planId +
					'&rectifyId=' +
					item.rectifyId +
					'&isOrder=false' +
					'&deptName=' +
					this.deptName
			});
		},
		// 查询条件过滤
		qFilter() {
			let obj = {};
			this.recordId != null && this.recordId != '' ? obj.recordId = this.recordId : null;
			return obj;
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
/* .page {
		height: calc(100vh - 75px);
	} */
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
