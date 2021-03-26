<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{print.deptName}}安全生产检查统计表</block>
		</cu-custom>
		<movable-area scale-area>
			<movable-view direction="all" scale="true" scale-min="0.1" scale-max="1">
				<table class="order_table" border="1px" cellspacing="0" cellpadding="0">
					<tr>
						<th class="order_title">所属公司</th>
						<th colspan="2">{{ print.deptName }}</th>
						<th class="order_title">项目名称</th>
						<th colspan="2">{{ print.proName }}</th>
						<th class="order_title">项目类别</th>
						<th>{{ print.typeName }}</th>
					</tr>
					<tr>
						<th class="order_title">通知书数量</th>
						<th colspan="3">{{ print.orderNum }}</th>
						<th class="order_title">时间</th>
						<th colspan="3">{{ print.date }}</th>
					</tr>
					<tr>
						<th class="order_title" :rowspan="this.print.detailNum">列表</th>
						<th class="order_title">序号</th>
						<th colspan="3">存在隐患</th>
						<th class="order_title">整改期限</th>
						<th class="order_title">整改时间</th>
						<th class="order_title">通知单号</th>
					</tr>
					<tr v-for="(t, i) in print.detailVOList" :key="i">
						<td class="order_title">{{ i + 1 }}</td>
						<td colspan="3">
							<p style="margin: 0;text-align: left;" v-for="(tt, ii) in t.concerns" :key="ii">{{ tt }}</p>
						</td>
						<td class="order_title">{{ t.rectifyPlanDate }}</td>
						<td class="order_title">{{ t.recordDate }}</td>
						<td class="order_title">{{ t.orderNo }}</td>
					</tr>
					<tr><td colspan="8">备注</td></tr>
				</table>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
import service from '@/service.js';
import basic from '@/api/basic';
export default {
	data() {
		return {
			imageUrl: service.getUrls().url,
			print: {}
		};
	},
	onLoad: function(option) {
		let me = this;
		me.imageUrl = me.imageUrl.replace('/web', '');
		if (JSON.stringify(option) != '{}') {
			basic
				.planReport(option.planId)
				.then(res => {
					if (res.flag) {
						this.print = res.data;
						this.print.detailNum = res.data.detailVOList.length + 1;
						this.print.detailVOList.forEach((item, index) => {
							if (item.concerns != null) {
								item.concerns = item.concerns.split('。');
							}
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
	}
};
</script>

<style>
movable-view {
	width: 100%;
	height: 100%;
}

movable-area {
	height: auto;
	width: 1800upx;
}
.order_table {
	width: 100%;
}
.order_table tr th {
	height: 30px;
	line-height: 30px;
}
.title {
	height: 30px;
	line-height: 30px;
	text-align: center;
}
</style>
