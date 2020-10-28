<template>
	<view class="empty-content">
		<text class="iconfont icon-web__zanwujilu"></text>
		<view class="text">{{Today}}</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
		};
	},
     props:{
		 Today: {
		 	type:String,
		 	default:'暂无数据'
		 }
	 },
	computed: {}
};
</script>

<style lang="scss">
.empty-content {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;

	padding: 200upx 0;
	.iconfont {
		font-size: 120upx;
	}

	.text {
		color: #666;
		font-size: 30upx;
	}
}
</style>
