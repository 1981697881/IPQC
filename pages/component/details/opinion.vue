<template>
	<view>
		<loading :loadModal="loadModal"></loading>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">整改意见</block>
		</cu-custom>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<form>
				<view class="cu-form-group">
					<view class="title">通知单号</view>
					<text>ZG122101</text>
				</view>
				<view class="cu-form-group">
					<view class="title">登记日期</view>
					<text>2020-10-10</text>
				</view>
				<view class="cu-form-group">
					<view class="title">隐患问题</view>
					<picker @change="PickerChange1" :value="index1" :range="picker1">
						<view class="picker">{{ index1 > -1 ? picker1[index1] : '请选择' }}</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">整改内容</view>
					<picker @change="PickerChange2" :value="index2" :range="picker2">
						<view class="picker">{{ index2 > -1 ? picker2[index2] : '请选择' }}</view>
					</picker>
				</view>
				<view class="cu-bar bg-white">
					<view class="action">隐患图片</view>
					<view class="action">{{ imgList.length }}/4</view>
				</view>
				<view class="cu-form-group">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item, index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
							<image :src="imgList[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index"><text class="cuIcon-close"></text></view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="imgList.length < 4"><text class="cuIcon-cameraadd"></text></view>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">要求整改完成日期</view>
					<picker mode="date" :value="date" start="2015-09-01" end="2020-09-01" @change="DateChange">
						<view class="picker">{{ date }}</view>
					</picker>
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
			index1: -1,
			index2: -1,
			picker1: ['A', 'B', 'C'],
			picker2: ['!', '@', '#'],
			multiIndex: [0, 0, 0],
			date: '2018-12-25',
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
				console.log(res.windowHeight);
				setTimeout(function() {
					me.pageHeight = res.windowHeight - headHeight - 30;
				}, 1000);
			}
		});
	},
	methods: {
		PickerChange1(e) {
			this.index1 = e.detail.value;
		},
		PickerChange2(e) {
			this.index2 = e.detail.value;
		},
		DateChange(e) {
			this.date = e.detail.value;
		},
		ChooseImage() {
			uni.chooseImage({
				count: 4, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: res => {
					if (this.imgList.length != 0) {
						this.imgList = this.imgList.concat(res.tempFilePaths);
					} else {
						this.imgList = res.tempFilePaths;
					}
				}
			});
		},
		ViewImage(indexImg, photoImg) {
			// 预览图片多张
			let photoList = photoImg.map(item => {
				let newImg = 'data:image/jpeg;base64,' + item;
				return newImg;
			}); //  这一步是为了给每一条图片数据，添加 'data:image/jpeg;base64,'。如果你的图片数据是完整的base64。此条步骤可以省略
			uni.previewImage({
				current: indexImg,
				urls: photoList
			});
		},
		DelImg(e) {
			uni.showModal({
				title: '温馨提醒',
				content: '是否删除该图片',
				cancelText: '确定',
				confirmText: '取消',
				success: res => {
					if (res.confirm) {
						this.imgList.splice(e.currentTarget.dataset.index, 1);
					}
				}
			});
		},
		textareaAInput(e) {
			this.textareaAValue = e.detail.value;
		},
		textareaBInput(e) {
			this.textareaBValue = e.detail.value;
		}
	}
};
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
.nav-title::first-letter {
	font-size: 16px;
	margin-right: 2px;
}
</style>
