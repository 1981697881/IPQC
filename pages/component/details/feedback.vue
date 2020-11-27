<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">整改登记</block>
		</cu-custom>
		<view class="cu-modal" style="z-index: 555;" :class="modalName2 == 'Modal' ? 'show' : ''">
			<view class="cu-dialog bg-white" style="height: auto">
				<view class="cu-bar justify-end margin-lr-xs" style="height: 70upx;border-bottom: 1px solid #CCCCCC;">
					<view class="content text-sl">申请延期</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<form>
					<view class="cu-form-group">
						<view class="title">延期期限</view>
						<picker mode="date" :value="winForm.delayTimeLimit" start="2020-12-01" end="2030-09-01" @change="DateChange($event,'delayTimeLimit')">
							<view class="picker">{{ winForm.delayTimeLimit }}</view>
						</picker>
					</view>
					<view class="cu-form-group">
						<view class="title">申请人</view>
						<picker @change="proposerChange" :range-key="'username'" :value="index" :range="userList">
							<view class="picker">{{ winForm.proposerName != '' ? winForm.proposerName : '请选择' }}</view>
						</picker>
					</view>
					<view class="cu-form-group">
						<view class="title">申请日期</view>
						<picker mode="date" :value="winForm.applicationDate" start="2020-12-01" end="2030-09-01" @change="DateChange($event,'applicationDate')">
							<view class="picker">{{ winForm.applicationDate }}</view>
						</picker>
					</view>
					<view class="cu-form-group">
						<view class="title">批准人</view>
						<text>{{ winForm.ratify }}</text>
					</view>
					<view class="cu-form-group">
						<view class="title">批准日期</view>
						<text>{{ winForm.approvalTime }}</text>
					</view>
					<view class="cu-form-group">
						<view class="title">整改完成日期</view>
						<text>{{ winForm.rectifyPlanDate }}</text>
					</view>
				</form>
				<view style="clear: both;" class="cu-bar bg-white justify-end padding-bottom-xl margin-top">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="$manyCk(saveCom)">确定</button>
					</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<form>
				<view class="cu-form-group">
					<view class="title">通知单号</view>
					<text>{{ form.planNo }}</text>
				</view>
				<view class="cu-form-group align-start">
					<view class="title">整改情况</view>
					<textarea maxlength="-1" v-model="form.checkContent" :disabled="modalName != null" @input="textareaBInput" placeholder="多行文本输入框"></textarea>
				</view>
				<view class="cu-bar bg-white">
					<view class="action">整改图片</view>
					<view class="action">{{ form.rectifyImg.length }}/3</view>
				</view>
				<view class="cu-form-group">
					<view class="grid col-3 grid-square flex-sub">
						<view class="bg-img" v-for="(item, index) in form.rectifyImg" :key="index" @tap="ViewImage" :data-url="form.rectifyImg[index]">
							<image :src="form.rectifyImg[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index"><text class="cuIcon-close"></text></view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="form.rectifyImg.length < 3"><text class="cuIcon-cameraadd"></text></view>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">整改跟踪人</view>
					<picker @change="rectifyChange" :range-key="'username'" :value="index1" :range="userList">
						<view class="picker">{{ form.rectifyName != '' ? form.rectifyName : '请选择' }}</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">要求整改完成时间</view>
					<picker mode="date" :value="form.rectifyPlanDate" start="2020-12-01" end="2030-09-01" @change="DateChangeT($event,'rectifyPlanDate')">
						<view class="picker">{{ form.rectifyPlanDate }}</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">是否延期</view>
					<button class="cu-btn bg-orange shadow" @tap="$manyCk(applyFor)">申请</button>
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
import basic from '@/api/basic';
export default {
	data() {
		return {
			pageHeight: 0,
			isClick: false,
			loadModal: false,
			form: {
				rectifyPlanDate: null,
				rectifyImg: [],
				rectifyName: '',
				rectifyUid: ''
			},
			index: -1,
			index1: -1,
			index2: -1,
			date: '2018-12-25',
			winForm: {
				delayTimeLimit: null,
				rectifyPlanDate: null,
				proposer: '',
				proposerName: '',
				ratify: '',
				approvalTime: '',
				applicationDate: null
			},
			userList: [],
			modalName: null,
			modalName2: null,
			textareaAValue: '',
			textareaBValue: ''
		};
	},
	onLoad: function(option) {
		let me = this;
		if (JSON.stringify(option) != '{}') {
			this.isOrder = true;
			this.planId = option.planId;
			this.deptName = option.deptName;
			basic
				.pollingRecordByPlanId(option.planId)
				.then(res => {
					if (res.flag) {
						if (res.data != null) {
							/* me.form = res.data; */
							me.form.rectifyPlanDate = me.getDay("",0).date
							me.winForm.delayTimeLimit = me.getDay("",0).date
							me.winForm.rectifyPlanDate = me.getDay("",0).date
						}else{
							me.form.rectifyPlanDate = me.getDay("",0).date
							me.winForm.delayTimeLimit = me.getDay("",0).date
							me.winForm.rectifyPlanDate = me.getDay("",0).date
						}
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
		me.initMain();
	},
	methods: {
		initMain() {
			const me = this;
			basic
				.userList()
				.then(res => {
					if (res.flag) {
						me.$set(me, 'userList', res.data);
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
		},
		saveCom() {
			var me = this;
			if (me.winForm.delayTimeLimit == '' || typeof this.winForm.delayTimeLimit == 'undefined') {
				return uni.showToast({
					icon: 'none',
					title: '请选择延期期限！'
				});
			}
			if (me.winForm.proposer == '' || typeof this.winForm.proposer == 'undefined') {
				return uni.showToast({
					icon: 'none',
					title: '请选择人员！'
				});
			}
			if (me.winForm.applicationDate == '' || typeof this.winForm.applicationDate == 'undefined') {
				return uni.showToast({
					icon: 'none',
					title: '请选择日期！'
				});
			}
			me.form.delayTimeLimit = me.winForm.delayTimeLimit
			me.form.applicationDate = me.winForm.delayTimeLimit
			me.form.proposer = me.winForm.delayTimeLimit
			me.modalName2 = null;
		},
		saveData() {
			if (this.cuIList.length > 0) {
				this.isClick = true;
				let result = [];
				let list = JSON.parse(JSON.stringify(this.cuIList));
				let me = this;
				let array = [];
				delete list[0].rectifyImg;
				basic
					.pollingRecordAdd(list[0])
					.then(res => {
						if (res.flag) {
							this.cuIList = [];
							uni.showToast({
								icon: 'success',
								title: res.msg
							});
							const uploadTask = uni.uploadFile({
								url: service.getUrls().url + 'file/imgUpload',
								filePath: me.cuIList[0].rectifyImg,
								name: 'imgS',
								success: function(uploadFileRes) {
									console.log(uploadFileRes.data);
									me.initMain();
									setTimeout(function() {
										uni.$emit('handleBack', { planId: this.planId, deptName: this.deptName, isback: true });
										uni.navigateBack({
											url: '../component/polling'
										});
									}, 1000);
								}
							});
							uploadTask.onProgressUpdate(function(res) {
								_self.percent = res.progress;
								console.log('上传进度' + res.progress);
								console.log('已经上传的数据长度' + res.totalBytesSent);
								console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
							});
						}
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.msg
						});
						this.isClick = false;
					});
			}
		},
		applyFor() {
			this.modalName2 = 'Modal';
			/* uni.navigateTo({
					url: '../details/applyFor'
				}); */
		},
		hideModal(e) {
			this.modalName2 = null;
		},
		rectifyChange(e){
			this.$set(this.form,'rectifyUid', this.userList[e.detail.value].uid);
			this.$set(this.form,'rectifyName', this.userList[e.detail.value].username);
		},proposerChange(e){
			this.$set(this.winForm,'proposer', this.userList[e.detail.value].uid);
			this.$set(this.winForm,'proposerName', this.userList[e.detail.value].username);
		},
		DateChange(e,val) {
			this.$set(this.winForm, val, e.detail.value);
		},
		DateChangeT(e,val){
		this.$set(this.form, val, e.detail.value);
		},
		ChooseImage() {
			uni.chooseImage({
				count: 3, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: res => {
					if (this.form.rectifyImg.length != 0) {
						this.form.rectifyImg = this.form.rectifyImg.concat(res.tempFilePaths);
					} else {
						this.form.rectifyImg = res.tempFilePaths;
					}
				}
			});
		},
		ViewImage(e) {
			uni.previewImage({
				urls: this.form.rectifyImg,
				current: e.currentTarget.dataset.url
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
						this.form.rectifyImg.splice(e.currentTarget.dataset.index, 1);
					}
				}
			});
		},
		textareaAInput(e) {
			this.textareaAValue = e.detail.value;
		},
		textareaBInput(e) {
			this.textareaBValue = e.detail.value;
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
.cu-form-group .title {
	min-width: calc(4em + 15px);
}
</style>
<style lang="scss" scoped>
.uni-picker-container {
	z-index: 1300 !important;
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
.nav-title::first-letter {
	font-size: 16px;
	margin-right: 2px;
}
</style>
