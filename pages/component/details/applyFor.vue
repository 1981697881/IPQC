<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">延期申请</block>
		</cu-custom>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
		<form>
			<view class="cu-form-group">
				<view class="title">延期期限</view>
				<picker mode="date" :value="date" start="2015-09-01" end="2020-09-01" @change="DateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">申请人</view>
				<picker @change="PickerChange" :value="index" :range="picker">
					<view class="picker">
						{{index>-1?picker[index]:'请选择'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">申请日期</view>
				<picker mode="date" :value="date" start="2015-09-01" end="2020-09-01" @change="DateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">批准人</view>
				<text>A</text>
			</view>
			<view class="cu-form-group">
				<view class="title">批准日期</view>
				<text>2020-10-10</text>
			</view>
			<view class="cu-form-group">
				<view class="title">整改完成日期</view>
				<text>2020-10-10</text>
			</view>
		</form>
		<view class="cu-bar tabbar shadow foot">
			<view class="box text-center">
				<button :disabled="isClick" class="cu-btn bg-green shadow-blur round lg" style="width: 40%;" @tap="$manyCk(saveData)">提交</button>
			</view>
		</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageHeight: 0,
				isClick: false,
				loadModal: false,
				index: -1,
				picker: ['喵喵喵', '汪汪汪', '哼唧哼唧'],
				multiIndex: [0, 0, 0],
				date: '2020-12-25',
				imgList: [],
				modalName: null,
				textareaAValue: '',
				textareaBValue: ''
			};
		},
		onReady: function() {
			var me = this;
			me.loadModal = false;
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
						console.log(res.windowHeight)
					setTimeout(function() {
						me.pageHeight = res.windowHeight - headHeight - 30;
					}, 1000);
				}
			});
		},
		methods: {
			PickerChange(e) {
				this.index = e.detail.value
			},
			DateChange(e) {
				this.date = e.detail.value
			},
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
<style>
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