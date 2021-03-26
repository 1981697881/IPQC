<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{ printData.deptName }}安全生产检查记录表</block>
		</cu-custom>
		<movable-area scale-area>
			<movable-view direction="all" scale="true" scale-min="0.1" scale-max="1">
				<table class="order_table" border="1px" cellspacing="0" cellpadding="0">
					<tr>
						<th class="order_title">被检公司</th>
						<th>{{ printData.deptName }}</th>
						<th class="order_title">被检项目</th>
						<th>{{ printData.proName }}</th>
						<th class="order_title">项目类别</th>
						<th>{{ printData.typeName }}</th>
					</tr>
					<tr>
						<th class="order_title">检查人员</th>
						<th colspan="3">{{ printData.inspector }}</th>
						<th class="order_title">检查时间</th>
						<th>{{ printData.checkTime }}</th>
					</tr>
					<tr>
						<th class="order_title">被检人员</th>
						<th colspan="3">{{ printData.checkStaff }}</th>
						<th class="order_title">检查单号</th>
						<th>{{ printData.checkNo }}</th>
					</tr>
					<tr>
						<th class="order_title">存在隐患</th>
						<th colspan="5">
							<p style="margin: 0;text-align: left;" v-for="(t, i) in printData.concerns" :key="i">{{ i + 1 }}:{{ t }}</p>
						</th>
					</tr>
					<tr>
						<th class="order_title">隐患图片</th>
						<th colspan="5">
							<image v-for="(t, i) in printData.concernsImg" :key="i" style="width: 100px; height: 100px" :src="imageUrl + t" mode="scaleToFill"></image>
						</th>
					</tr>
					<tr>
						<th class="order_title">整改意见</th>
						<th colspan="5">
							<p style="margin: 0;text-align: left;" v-for="(t, i) in printData.opinion" :key="i">{{ t }}</p>
						</th>
					</tr>
					<tr>
						<th class="order_title">备注</th>
						<th colspan="3"></th>
						<th class="order_title">整改期限</th>
						<th>{{ printData.rectifyPlanDate }}</th>
					</tr>
					<tr>
						<th class="order_title">被检公司代表签名</th>
						<th colspan="5"><image style="width: 100px; height: 100px" :src="imageUrl + printData.signature" mode="scaleToFill"></image></th>
					</tr>
					<tr><th colspan="6">隐患整改反馈</th></tr>
					<tr>
						<th class="order_title">整改内容</th>
						<th colspan="5">{{ printData.checkContent }}</th>
					</tr>
					<tr>
						<th class="order_title">整改图片</th>
						<th colspan="5">
							<image v-for="(t, i) in printData.rectifyImg" :key="i" style="width: 100px; height: 100px" :src="imageUrl + t" mode="scaleToFill"></image>
						</th>
					</tr>
					<tr>
						<th class="order_title">整改情况</th>
						<th>{{ printData.rectifyContent }}</th>
						<th class="order_title">整改跟踪人</th>
						<th>{{ printData.rectifyName }}</th>
						<th class="order_title">完成时间</th>
						<th>{{ printData.rectifyFinishDate }}</th>
					</tr>
					<tr><th colspan="6">整改延期反馈</th></tr>
					<tr>
						<th class="order_title">延期原因</th>
						<th colspan="5">{{ printData.delayReason }}</th>
					</tr>
					<tr>
						<th class="order_title">整改完成情况</th>
						<th colspan="5">{{ printData.rectifyContent }}</th>
					</tr>
					<tr>
						<th class="order_title">延期期限</th>
						<th colspan="3">{{ printData.delayTimeLimit }}</th>
						<th class="order_title">申请人</th>
						<th>{{ printData.proposer }}</th>
					</tr>
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
			printData: {}
		};
	},
	onLoad: function(option) {
		let me = this;
		me.imageUrl = me.imageUrl.replace('/web', '');
		me.imageUrl = me.imageUrl + 'uploadFiles/image/';
		if (JSON.stringify(option) != '{}') {
			basic
				.recordFindAll({ recordId: option.recordId })
				.then(res => {
					if (res.flag) {
						this.printData = res.data;
						this.printData.concerns = res.data.concerns.split(',');
						this.printData.concernsImg = res.data.concernsImg.split(',');
						this.printData.opinion = res.data.opinion.split('。');
						this.printData.rectifyImg = res.data.rectifyImg.split(',');
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
	width: 3000upx;
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
