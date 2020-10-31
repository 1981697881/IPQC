<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">巡检计划</block>
		</cu-custom>
		<scroll-view scroll-y class="page">
			<view class="box getheight">
				<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
					<view class="action">
						被检公司:
						<text>{{ form.finBillNo }}</text>
					</view>
					<view class="action">
						被检项目:
						<text>{{ form.finBillNo }}</text>
					</view>
				</view>
				<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
					<view class="action">
						巡检/整改日期:
						<text>{{ form.finBillNo }}</text>
					</view>
					<view class="action">
						计划状态:
						<text>{{ form.finBillNo }}</text>
					</view>
				</view>
			</view>
			<view class="bg-white evan-step-show__title text-center"><text class="evan-step-show__title__item"></text></view>
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
				<!-- <evan-step title="延期申请" description="2020-10-10 10:10:10">
					<template v-slot:icon>
						<image class="evan-step-show__show" src="/static/logo.png"></image>
					</template>
				</evan-step> -->
				</navigator>
			</evan-steps>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
</template>

<script>
import basic from '@/api/basic';
import EvanSteps from '@/components/evan-steps/evan-steps.vue';
import EvanStep from '@/components/evan-steps/evan-step.vue';
import UniIcons from '@/components/uni-icons/uni-icons.vue';
export default {
	components: {
		EvanSteps,
		EvanStep,
		UniIcons
	},
	data() {
		return {
			form: {
				finBillNo: null,
				fdate: '',
				bNum: 0,
				fnote: '',
				FCustNumber: '',
				fbillerID: null,
				fdCStockId: '',
				FCustName: '',
				fdeptID: ''
			},
			elements: [{
					title: '打卡',
					status: '',
					path: 'ClockIn/ClockIn',
					icon: 'location',
					description: '2020-10-10 12:20:30'
				},{
					title: '巡检登记',
					icon: '',
					status: 'error',
					path: 'component/details/inspection',
					description: '2020-10-10 12:20:30'
				},{
					title: '整改登记',
					icon: '',
					status: '',
					path: 'component/details/abarbeitung',
					description: '2020-10-10 12:20:30'
				},{
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
				}]
		};
	},
	onLoad: function(option) {
		console.log(option);
		let me = this;
		if (JSON.stringify(option) != '{}') {
			/* basic.getSysMenuById(option.id).then(rest => {
				let data = rest.data;
				for (let i in data) {
					let disLength = data[i].name.length;
					data[i].title = data[i].name.substring(disLength - 3, disLength);
					data[i].name = data[i].name.substring(0, disLength - 3);
				}
				console.log(data);
				this.elements = data; 
			});*/
		}
	},
	methods: {}
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
