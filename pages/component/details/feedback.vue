<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">整改登记</block>
			<block slot="right"><text @tap="$manyCk(handleShare)" class="cuIcon-forward margin-right-xs">分享</text></block>
		</cu-custom>
		<view>
		   <progress :percent="percent" stroke-width="10"></progress>
		  </view>
		<view class="cu-modal" style="z-index: 555;" :class="modalName2 == 'Modal' ? 'show' : ''">
			<view class="cu-dialog bg-white" style="height: auto">
				<view class="cu-bar justify-end margin-lr-xs" style="height: 70upx;border-bottom: 1px solid #CCCCCC;">
					<view class="content text-sl">申请延期</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<form>
					<view class="cu-form-group">
						<view class="title">延期期限</view>
						<picker mode="date" :value="winForm.delayTimeLimit" start="2020-12-01" end="2030-09-01" @change="DateChange($event, 'delayTimeLimit')">
							<view class="picker">{{ winForm.delayTimeLimit }}</view>
						</picker>
					</view>
					<view class="cu-form-group">
						<view class="title">延期原因</view>
						<input placeholder="请输入" v-model="winForm.delayReason" name="input"/>
					</view>
					<view class="cu-form-group">
						<view class="title">申请人</view>
						<input placeholder="请输入" v-model="winForm.proposerName" name="input"/>
						<!-- <picker @change="proposerChange" :range-key="'username'" :value="index" :range="userList">
							<view class="picker">{{ winForm.proposerName != '' ? winForm.proposerName : '请选择' }}</view>
						</picker> -->
					</view>
					<view class="cu-form-group">
						<view class="title">申请日期</view>
						<picker mode="date" :value="winForm.applicationDate" start="2020-12-01" end="2030-09-01" @change="DateChange($event, 'applicationDate')">
							<view class="picker">{{ winForm.applicationDate }}</view>
						</picker>
					</view>
					<!-- <view class="cu-form-group">
						<view class="title">批准人</view>
						<text>{{ winForm.ratify }}</text>
					</view>
					<view class="cu-form-group">
						<view class="title">批准日期</view>
						<text>{{ winForm.approvalTime }}</text>
					</view>
					<view class="cu-form-group">
						<view class="title">整改完成日期</view>
						<text>{{ winForm.rectifyFinishDate }}</text>
					</view> -->
					<view class="cu-form-group align-start">
						<view class="title">整改完成情况</view>
						<textarea maxlength="-1" v-model="winForm.rectifyContent" :disabled="modalName != null"  placeholder="整改完成情况"></textarea>
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
					<view class="title">被检人员</view>
					<picker @change="checkStaffChange" :range-key="'username'" :value="index3" :range="userList">
						<view class="picker">{{ form.checkStaffName != '' ? form.checkStaffName : '请选择' }}</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">陪同人员</view>
					<input placeholder="请输入" v-model="form.escort" name="input"></input>
				</view>
				<view class="cu-form-group align-start">
					<view class="title">整改内容</view>
					<textarea maxlength="-1" v-model="form.checkContent" :disabled="modalName != null" placeholder="整改内容"></textarea>
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
					<picker mode="date" :value="form.rectifyPlanDate" start="2020-12-01" end="2030-09-01" @change="DateChangeT($event, 'rectifyPlanDate')">
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
import service from '@/service.js';
import basic from '@/api/basic';
export default {
	data() {
		return {
			percent:0,
			pageHeight: 0,
			isClick: false,
			loadModal: false,
			onoff: true,
			form: {
				rectifyPlanDate: null,
				rectifyImg: [],
				checkStaffName: '',
				checkStaff: '',
				rectifyName: '',
				rectifyUid: '',
			},
			index: -1,
			index1: -1,
			index2: -1,
			index3: -1,
			date: '2018-12-25',
			winForm: {
				delayTimeLimit: null,
				rectifyPlanDate: null,
				proposer: '',
				proposerName: '',
				ratify: '',
				approvalTime: '',
				delayReason: '',
				rectifyContent: '',
				applicationDate: null
			},
			userList: [],
			modalName: null,
			modalName2: null,
			textareaAValue: '',
			textareaBValue: ''
		};
	},
	onShow: function (option){
		let me = this
		console.log(12323) 
		uni.$on("handleClockIn", res => {
			console.log(res)
			me.form.clockTime = res.clockTime
			me.form.clockLocation = res.clockLocation
		})
	},		
	onLoad: function(option) {
		let me = this;
		console.log(option)
		me.initMain();
		if (JSON.stringify(option) != '{}') {
			this.isOrder = true;
			this.planId = option.planId;
			this.deptName = option.deptName;
			basic
				.pollingRecordByPlanId(option.planId)
				.then(res => {
					console.log(res)
					if (res.flag) {
						if (res.data != null) {
							me.form = res.data;
							me.form.rectifyName = '';
							for(let i in me.userList){
								if(me.userList[i].uid == parseInt(me.form.checkStaff)){
									me.$set(me.form, 'checkStaffName', me.userList[i].username);
								}
							}
							me.form.rectifyPlanDate == null ? (me.form.rectifyPlanDate = me.getDay('', 0).date) : res.data.rectifyPlanDate;
							me.winForm.delayTimeLimit == null ? (me.winForm.delayTimeLimit = me.getDay('', 0).date) : res.data.delayTimeLimit;
							me.winForm.rectifyPlanDate == null ? (me.winForm.rectifyPlanDate = me.getDay('', 0).date) : res.data.rectifyPlanDate;
							me.winForm.applicationDate == null ? (me.winForm.applicationDate = me.getDay('', 0).date) : res.data.applicationDate;
						} else {
							me.form.rectifyPlanDate = me.getDay('', 0).date;
							me.winForm.delayTimeLimit = me.getDay('', 0).date;
							me.winForm.rectifyPlanDate = me.getDay('', 0).date;
							me.winForm.applicationDate = me.getDay('', 0).date;
						}
						me.form.clockTime = option.clockTime
						me.form.clockLocation = option.clockLocation
						console.log(me.form)
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
			me.form.delayTimeLimit = me.winForm.delayTimeLimit;
			me.form.applicationDate = me.winForm.delayTimeLimit;
			me.form.proposer = me.winForm.delayTimeLimit;
			me.form.delayReason = me.winForm.delayReason;
			me.form.rectifyContent = me.winForm.rectifyContent;
			me.modalName2 = null;
		},
		saveData() {
			let me = this;
			if (me.form.checkContent == '' || typeof this.form.checkContent == 'undefined') {
				return uni.showToast({
					icon: 'none',
					title: '请输入整改情况！'
				});
			}
			if (me.form.rectifyUid == '' || typeof this.form.rectifyUid == 'undefined') {
				return uni.showToast({
					icon: 'none',
					title: '请选择人员！'
				});
			}
			if (me.form.rectifyPlanDate == '' || typeof this.form.rectifyPlanDate == 'undefined') {
				return uni.showToast({
					icon: 'none',
					title: '请选择日期！'
				});
			}
			this.isClick = true;
			let rectifyImg = [];
			let form = JSON.parse(JSON.stringify(this.form));
			delete form.rectifyImg;
			delete me.form.recordCheckList
			for (let i = 0; i < me.form.rectifyImg.length; i++) {
			const uploadTask = uni.uploadFile({
				url: service.getUrls().url+'file/imgUpload',
				filePath: me.form.rectifyImg[i],
				name: 'imgS',
				header: {
					'Authorization': me.$store.state.token
				},
				success: function(uploadFileRes) {
					uni.$off('handleClockIn');
					let data = JSON.parse(uploadFileRes.data)
					if(data.flag){
						rectifyImg.push(data.data)
						if((i+1) == me.form.rectifyImg.length){
							form.rectifyImg = rectifyImg.toString()
							console.log(form)
							basic
								.recordRectifyAdd(form)
								.then(res => {
									if (res.flag) {
										uni.$emit('handleBack', { planId: me.planId, deptName: me.deptName, isback: true });
										uni.showToast({
											icon: 'success',
											title: res.msg,
											duration: 2000
										});
										uni.navigateBack({
											delta:2,  
											url: '../component/polling'
										});
									}
								})
								.catch(err => {
									uni.showToast({
										icon: 'none',
										title: err.msg
									});
									me.isClick = false;
								});
						}
					}
					uni.showToast({
						icon: 'success',
						title: data.msg
					});
				},
				fail: err => {
					console.log('uploadImage fail', err);
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
				}
			});
			uploadTask.onProgressUpdate(function(reso) {
				/* console.log(reso); */
				me.percent = reso.progress;
				/* console.log('上传进度' + reso.progress);
				console.log('已经上传的数据长度' + reso.totalBytesSent);
				console.log('预期需要上传的数据总长度' + reso.totalBytesExpectedToSend); */
			});
			}
			
		},
		handleShare(){
			uni.share({
			    provider: "weixin",
			    scene: "WXSceneSession",
			    type: 1,
			    summary: "测试",
			    success: function (res) {
			        console.log("success:" + JSON.stringify(res));
			    },
			    fail: function (err) {
			        console.log("fail:" + JSON.stringify(err));
			    }
			});
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
		rectifyChange(e) {
			this.$set(this.form, 'rectifyUid', this.userList[e.detail.value].uid);
			this.$set(this.form, 'rectifyName', this.userList[e.detail.value].username);
		},
		checkStaffChange(e) {
			this.$set(this.form, 'checkStaff', this.userList[e.detail.value].uid);
			this.$set(this.form, 'checkStaffName', this.userList[e.detail.value].username);
			console.log(this.form)
		},
		proposerChange(e) {
			this.$set(this.winForm, 'proposer', this.userList[e.detail.value].uid);
			this.$set(this.winForm, 'proposerName', this.userList[e.detail.value].username);
		},
		DateChange(e, val) {
			this.$set(this.winForm, val, e.detail.value);
		},
		DateChangeT(e, val) {
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
			let me = this
			uni.showModal({
				title: '温馨提醒',
				content: '是否删除该图片',
				cancelText: '确定',
				confirmText: '取消',
				success: res => {
					if (res.confirm) {
						me.form.rectifyImg.splice(e.currentTarget.dataset.index, 1);
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
		}
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
