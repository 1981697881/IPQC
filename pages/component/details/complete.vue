<template>
	<view>
		<loading :loadModal="loadModal"></loading>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">巡检完成</block>
		</cu-custom>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<view v-for="(item, index) in cuIList" :key="index" style="margin-top: 10px;">
				<view class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="cuIcon-titles text-orange"></text> 隐患问题
					</view>
					<view class="action" >
						2020-10-01
					</view>
				</view>
				<view class="cu-card no-card case">
					<view class="cu-item shadow">
						<view class="cu-list menu-avatar">
							<view class="cu-item">
								<view class="cu-avatar lg">
									√
								</view>
								<view class="content flex-sub">
									<view class="text-grey">整改内容</view>
									<view class="text-gray text-sm flex justify-between">
										A先生
										<view class="text-gray text-sm">
											<text class="cuIcon-remind margin-lr-xs"></text> 2020-10-10
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="cu-bar menu-avatar">
							<view class="action">
								<button class="cu-btn bg-blue round sm" @tap="previewImage">隐患图片</button>
							</view>
							<view class="action" >
								<button class="cu-btn bg-orange round sm" @tap="previewImage">整改完成图片</button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-bar tabbar shadow foot">
				<view class="box text-center">
					<button :disabled="isClick" class="cu-btn bg-green shadow-blur round lg" style="width: 40%;" @tap="$manyCk(saveData)">巡检完成</button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
import ldSelect from '@/components/ld-select/ld-select.vue';
import uniFab from '@/components/uni-fab/uni-fab.vue';
import basic from '@/api/basic';
import citySelect from '@/components/city-select/city-select.vue';
import service from '@/service.js';
import loading from '@/components/loading';
export default {
	components: { ruiDatePicker, ldSelect, uniFab, loading, citySelect },
	data() {
		return {
			pageHeight: 0,
			isOrder: false,
			isDis: false,
			onoff: true,
			isClick: false,
			loadModal: false,
			pickerVal: null,
			modalName: null,
			modalName2: null,
			gridCol: 3,
			skin: false,
			listTouchStart: 0,
			listTouchDirection: null,
			isCard: false,
			cuIList: [{},{}],
			startDate: null,
			endDate: null
		};
	},
	onLoad: function(option) {
		let me = this;
		if (JSON.stringify(option) != '{}') {
			this.isOrder = true;
			me.form.kingDeeNo = option.kingDeeNo;
			me.form.productWorkDetailId = option.productWorkDetailId;
			me.form.lotNo = option.lotNo;
			me.form.model = option.model;
			me.form.planNum = option.planNum;
			me.form.processCard = option.processCard;
			me.form.productName = option.productName;
			me.form.productNumber = option.productNumber;
			me.form.workNo = option.workNo;
			me.startDate = option.startDate;
			me.endDate = option.endDate;
			workshop
				.formatByProductWork({ productWorkDetailId: option.productWorkDetailId })
				.then(res => {
					if (res.success) {
						me.processList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				}); 
		}
	},
	onReady: function() {
		var me = this;
		me.loadModal = false;
		uni.getSystemInfo({
			success: function(res) {
				// res - 各种参数
				let info = uni.createSelectorQuery().select('.getheight');
				let customHead = uni.createSelectorQuery().select('.customHead');
				var headHeight = 0;
				customHead
					.boundingClientRect(function(data) {
						//data - 各种参数
						headHeight = data.height;
					})
					.exec();
				setTimeout(function() {
					me.pageHeight = res.windowHeight - headHeight - 30;
				}, 1000);
			}
		});
		/* if (service.getUsers().length > 0) {
			if (service.getUsers()[0].account != '' && service.getUsers()[0].account != 'undefined') {
				me.form.fbillerID = service.getUsers()[0].userId;
				me.form.username = service.getUsers()[0].username;
				uni.getSystemInfo({
					success: function(res) {
						// res - 各种参数
						let info = uni.createSelectorQuery().select('.getheight');
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
				me.initMain();
			}
		} */
	},
	methods: {
		IsCard(e,item) {
			this.$set(item, 'isCard' , e.detail.value)
			/* this.isCard = e.detail.value */
		},
		// 预览图片多张
		    previewImage() {
					let imgList = ['https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg','https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg']
					uni.previewImage({
						current: imgList.length,
						urls: imgList
					});
				},
		initMain() {
			const me = this;
			this.form.workDate = this.getDay('', 0).date;
			basic
				.getDeptList({})
				.then(res => {
					if (res.success) {
						me.deptList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
			basic
				.getEmpList({})
				.then(res => {
					if (res.success) {
						me.empList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
			me.loadModal = false;
			me.isClick = false;
		},
		saveData() {
			this.isClick = true;
			let result = [];
			let list = this.cuIList;
			let me = this;
			let array = [];
			for (let i in list) {
				let obj = {};
				obj.userId = list[i].userId;
				obj.dispatchNum = list[i].dispatchNum;
				obj.processId = this.form.processID;
				obj.processTeamId = this.form.fdeptID;
				obj.productWorkDetailId = this.form.productWorkDetailId;
				array.push(obj);
			}
			console.log(JSON.stringify(array));
			if (this.form.processID == null || this.form.processID == '') {
				this.isClick = false;
				return uni.showToast({
					icon: 'none',
					title: '工序不能为空'
				});
			}
			if (this.form.fdeptID == null || this.form.fdeptID == '') {
				this.isClick = false;
				return uni.showToast({
					icon: 'none',
					title: '班组不能为空'
				});
			}

			if (array.length <= 0) {
				this.isClick = false;
				return uni.showToast({
					icon: 'none',
					title: '请派工'
				});
			}
			if (Number(this.form.bNum) > Number(this.form.planNum)) {
				this.isClick = false;
				return uni.showToast({
					icon: 'none',
					title: '不能大于计划数量'
				});
			}
			if (this.form.workDate == null || this.form.workDate == '') {
				this.isClick = false;
				return uni.showToast({
					icon: 'none',
					title: '日期不能为空'
				});
			}
			workshop
				.productWorkDispatchAdd(JSON.stringify(array))
				.then(res => {
					if (res.success) {
						this.cuIList = [];
						uni.showToast({
							icon: 'success',
							title: res.msg
						});
						this.form.bNum = 0;
						this.initMain();
						if (this.isOrder) {
							setTimeout(function() {
								uni.$emit('handleBack', { startDate: me.startDate, endDate: me.endDate });
								uni.navigateBack({
									url: '../workshop/dispatching'
								});
							}, 1000);
						}
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
					this.isClick = false;
				});
		},
		del(index, item) {
			this.cuIList.splice(index, 1);
			var count = 0;
			for (var i = 0; i < list.length; i++) {
				count += Number(list[i].dispatchNum);
			}
			this.form.bNum = count;
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
		
	}
};
</script>

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
