<template name="components">
	<view>
		<scroll-view scroll-y class="page">
			<view class="cu-bar bg-cyan">
				<view></view>
				<view class="content"></view>
				<view class="action" style="margin-top: 15px;">
					<navigator :url="'/pages/component/setting'"><text class="cuIcon-settings" style="font-size: 21px;"></text></navigator>
				</view>
			</view>
			<!-- <view class="nav-list">
				<navigator
					hover-class="none"
					:url="'/pages/component/' + item.path + '?id=' + item.id"
					class="nav-li"
					navigateTo
					:class="'bg-' + item.color"
					v-for="(item, index) in elements"
					:key="index"
				>
					<view class="nav-title">{{ item.name }}</view>
					<text :class="'cuIcon-' + item.cuIcon"></text>
				</navigator>
			</view>
			<view class="cu-tabbar-height"></view> -->
			<view style="margin-left: 10px;margin-right: 10px;" class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-title text-orange "></text> 巡检计划
				</view>
			</view>
			<view style="margin-left: 10px;margin-right: 10px;" class="cu-list menu-avatar">
				<navigator
					hover-class="none"
					:url="'/pages/component/polling?id=' + item.id"
					navigateTo
					class="cu-item"
					v-for="(item, index) in elements"
					:key="index"
				>
						<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>
						<view class="content">
							<view class="text-grey">公司:A项目组</view>
							<view class="text-gray text-sm flex">
								<view class="text-cut">
									<text class="cuIcon-infofill text-red  margin-right-xs"></text>
									项目：施工安全
								</view> </view>
						</view>
						<view class="action">
							<view class="text-grey text-xs">2020-10-28</view>
							<view class="cu-tag round bg-grey sm">5</view>
						</view>
				</navigator>
				
				
			</view>
		</scroll-view>
	</view>
</template>

<script>
import service from '@/service.js';
import basic from '@/api/basic';
export default {
	created() {
		if (service.getUsers().length > 0) {
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
		}
	},
	data() {
		return {
			elements: [
				/* {
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
				},
				{
					title: '生产管理',
					name: 'production',
					color: 'pink',
					cuIcon: 'list'
				},
				{
					title: '仓库管理',
					name: 'warehouse',
					color: 'brown',
					cuIcon: 'newsfill'
				},
				{
					title: '委外',
					name: 'outsourcing',
					color: 'red',
					cuIcon: 'formfill'
				},
				{
					title: '车间管理',
					name: 'workshop',
					color: 'orange',
					cuIcon: 'timefill'
				},
				{
					title: '库存查询',
					name: 'inventory',
					color: 'green',
					cuIcon: 'messagefill'
				},
				{
					title: '快速录单',
					name: 'indent',
					color: 'olive',
					cuIcon: 'album'
				} */
			]
		};
	}
};
</script>

<style>
	.cu-list.menu-avatar>.cu-item .action {
	    width: 64px;
	    text-align: right;
	}
.page {
	height: 100vh;
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
</style>
