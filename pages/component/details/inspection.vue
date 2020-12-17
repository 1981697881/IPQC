<template>
	<view>
		<loading :loadModal="loadModal"></loading>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">巡检登记</block>
			<!-- <block slot="right"><text @tap="$manyCk(handleShare)" class="cuIcon-forward margin-right-xs">分享</text></block> -->
		</cu-custom>
		<uni-fab
			v-show="isFab"
			:pattern="pattern"
			:horizontal="horizontal"
			:vertical="vertical"
			cuIcon="add"
			:popMenu="popMenu"
			:direction="direction"
			@fabClick="fabClick"
		></uni-fab>
		<view><progress :percent="percent" stroke-width="10"></progress></view>
		<view class="cu-modal" style="z-index: 1111" :class="modalName2 == 'Modal' ? 'show' : ''">
			<view class="cu-dialog bg-white" style="height: 400upx;">
				<view class="cu-bar justify-end margin-lr-xs" style="height: 70upx;border-bottom: 1px solid #CCCCCC;">
					<view class="content text-sl">检查登记</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="cu-bar solid-bottom" style="height: 60upx;">
					<view class="action">
						<view style="width: 70px;">被检人员：</view>
						<!-- <ld-select
							:list="userList"
							list-key="username"
							value-key="uid"
							placeholder="请选择"
							clearable
							v-model="winForm.checkStaff"
							@change="userListChange"
						></ld-select> -->
						<input placeholder="请输入" v-model="winForm.checkStaff" name="input" />
					</view>
				</view>
				<view class="cu-bar solid-bottom" style="height: 60upx;">
					<view class="action">
						<view style="width: 70px;">检查项目:</view>
						<ld-select
							:multiple="true"
							:list="projectCheckList"
							list-key="checkName"
							value-key="checkId"
							placeholder="请选择"
							clearable
							v-model="winForm.checkId"
							@change="checkListChange"
						></ld-select>
					</view>
				</view>
				<view class="cu-bar solid-bottom" style="height: 60upx;">
					<view class="action">
						<view style="width: 70px;">陪同人员:</view>
						<input placeholder="请输入" v-model="winForm.escort" name="input" />
					</view>
				</view>
				<view style="clear: both;" class="cu-bar bg-white justify-end padding-bottom-xl margin-top">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="$manyCk(saveCom)">确定</button>
					</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<view v-for="(item, index) in cuIList" :key="index" style="margin-top: 10px;">
				<view class="cu-list menu-avatar">
					<view class="cu-item" style="width: 100%;margin-top: 2px;height: auto;" @longpress="del(index, item)">
						<view style="clear: both;width: 100%;">
							<view class="cu-bar bg-white solid-bottom">
								<view class="action">
									<text class="cuIcon-titles text-orange"></text>
									被检人员:{{ item.checkStaffName }}
								</view>
								<view class="action">
									登记日期：{{ item.recordDate }}
									<!-- <switch :class="item.isCard ? 'checked' : ''" :checked="item.isCard ? true : false" @change="IsCard($event, item)"></switch> -->
								</view>
							</view>
							<view class="cu-card no-card case">
								<view class="cu-item shadow">
									<view class="cu-list menu-avatar">
										<!-- 
										<view class="cu-item">
											<view class="cu-avatar round lg" style="background-image:url(../../static/OK.png);"></view>
											<view class="content flex-sub">
												<view class="text-grey">检查项目：{{ item.checkName }}</view>
												<view class="text-gray text-sm flex justify-between">
													登记日期：{{item.recordDate}}
												</view>
											</view>
											<view @tap="unfoldSetting" v-show="isAdd" style="position: absolute;" class="action">
												<text class="cuIcon-add text-red" style="font-size: 21px;"></text>
											</view>
											<view @tap="closeSetting" v-show="isClose" style="position: absolute;" class="action">
												<text class="cuIcon-close text-red" style="font-size: 21px;"></text>
											</view>
										</view> -->
										<view class="cu-bar bg-white"><view class="action">检查项目</view></view>
										<view class="cu-list menu">
											<view v-for="(item2, index2) in item.recordCheckList" :key="index2" class="cu-item" style="height: 30px;">
												<view class="content padding-sm" style="left: 0;">
													<view>
														<text class="cuIcon-text text-blue margin-right-xs"></text>
														{{ item2.checkName }}
													</view>
												</view>
												<view class="action" style="position: absolute;right:0;">
													<checkbox-group class="block" @change="CheckboxChange($event, item2, item)">
														<checkbox
															class="round blue"
															:class="item2.checked ? 'checked' : ''"
															:checked="item2.checked ? true : false"
															:value="item2.checkId"
														></checkbox>
													</checkbox-group>
												</view>
											</view>
										</view>
										<view v-show="item.isThrough" class="cu-bar bg-white"><view class="action">隐患问题</view></view>
										<view v-show="item.isThrough" class="cu-list menu">
											<view v-for="(item2, index2) in item.concerns" :key="index2" class="cu-item" style="height: auto;">
												<view class="content padding-sm" style="left: 0;">
													<view>
														<text class="cuIcon-warn text-blue margin-right-xs"></text>
														{{ item2.concerns }}
													</view>
												</view>
												<view class="action" style="position: absolute;right:0;">
													<checkbox-group class="block" @change="CheckConIdChange($event, item2, item)">
														<checkbox
															class="round blue"
															:class="item2.checked ? 'checked' : ''"
															:checked="item2.checked ? true : false"
															:value="item2.conId"
														></checkbox>
													</checkbox-group>
												</view>
											</view>
										</view>
										<view v-show="item.isThrough" class="cu-form-group align-start">
											<view class="title">整改内容</view>
											<textarea v-model="item.opinion" maxlength="-1" :disabled="modalName != null" placeholder="整改内容"></textarea>
										</view>
										<view v-show="item.isThrough" class="cu-bar bg-white">
											<view class="action">隐患图片</view>
											<view class="action">{{ item.rectifyImg.length }}/3</view>
										</view>
										<view v-show="item.isThrough" class="cu-form-group">
											<view class="grid col-3 grid-square flex-sub">
												<view
													class="bg-img"
													v-for="(item3, index3) in item.rectifyImg"
													:key="index3"
													@tap="ViewImage($event, item)"
													:data-url="item.rectifyImg[index3]"
												>
													<image :src="item.rectifyImg[index3]" mode="aspectFill"></image>
													<view class="cu-tag bg-red" @tap.stop="DelImg($event, item)" :data-index="index3"><text class="cuIcon-close"></text></view>
												</view>
												<view class="solids" @tap="ChooseImage(item)" v-if="item.rectifyImg.length < 3"><text class="cuIcon-cameraadd"></text></view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-bar tabbar shadow foot">
				<view class="box text-center">
					<button :disabled="isClick" class="cu-btn bg-green shadow-blur round lg" style="width: 40%;" @tap="$manyCk(saveData)">提交</button>
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
			percent: 0,
			loading: false,
			disabled: false,
			pageHeight: 0,
			isDis: false,
			onoff: true,
			isFab: true,
			isClick: false,
			isClose: false,
			isThrough: false, //是否展示明细
			isAdd: false, // 是否展示“+”号
			loadModal: false,
			pickerVal: null,
			modalName: null,
			modalName2: null,
			gridCol: 3,
			projectCheckList: [],
			userList: [],
			listTouchStart: 0,
			listTouchDirection: null,
			horizontal: 'right',
			vertical: 'bottom',
			popMenu: false,
			direction: 'horizontal',
			winForm: {
				checkId: [],
				planId: '',
				escort: '',
				clockTime: '',
				clockLocation: ''
			},
			pattern: {
				color: '#7A7E83',
				backgroundColor: '#fff',
				selectedColor: '#007AFF',
				buttonColor: '#007AFF'
			},
			isCard: false,
			cuIList: []
		};
	},
	onShow: function(option) {
		let me = this;
		console.log(12213113);
		uni.$on('recordClockIn', res => {
			console.log(res);
			me.winForm.clockTime = res.clockTime;
			me.winForm.clockLocation = res.clockLocation;
		});
	},
	onLoad: function(option) {
		let me = this;
		console.log(option);
		if (JSON.stringify(option) != '{}') {
			me.planId = option.planId;
			me.deptName = option.deptName;
			me.winForm.clockTime = option.clockTime;
			me.winForm.clockLocation = option.clockLocation;
			me.getList(option.planId);
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
					me.pageHeight = res.windowHeight - headHeight - 40;
				}, 1000);
			}
		});
		me.initMain();
	},
	methods: {
		handleShare() {
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 1,
				summary: '测试',
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		},
		getList(option) {
			let me = this;
			basic
				.pollingRecordByPlanId(option)
				.then(res => {
					if (res.flag) {
						if (res.data == null) {
							me.isFab = true;
						} else {
							me.isFab = false;
							me.cuIList.push(res.data);
							let recodList = me.cuIList[0].recordCheckList;
							recodList.forEach(item => {
								item.checked = true;
							});
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
		},
		del(index, item) {
			let me = this;
			uni.showModal({
				title: '温馨提示',
				content: '是否删除当前行,删除将无法复原？',
				cancelText: '取消',
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						me.cuIList.splice(index, 1);
						me.isFab = true;
					}
				}
			});
		},
		unfoldSetting() {
			this.$set(this, 'isThrough', true);
			this.$set(this, 'isClose', true);
			this.$set(this, 'isAdd', false);
		},
		closeSetting() {
			this.$set(this, 'isThrough', false);
			this.$set(this, 'isClose', false);
			this.$set(this, 'isAdd', true);
		},
		//event:默认参数,item: 子数据,item2:父数据
		CheckboxChange(e, item, item2) {
			let me = this;
			if (item.checked) {
				me.$set(item2, 'concerns', []);
				this.$set(item, 'checked', false);
				this.$set(item2, 'isThrough', true);
				let arr = item2.recordCheckList;
				arr.forEach(i => {
					if (!i.checked) {
						basic
							.formatListByCheckId(i.checkId)
							.then(res => {
								if (res.flag) {
									let data = res.data;
									let str = item2.concerns;
									data.forEach((items, indexs) => {
										str.push({
											conId: items.conId.toString(),
											concerns: items.concerns,
											opinion: items.opinion,
											checked: false
										});
									});
									me.$set(item2, 'concerns', str);
								}
							})
							.catch(err => {
								uni.showToast({
									icon: 'none',
									title: err.msg
								});
							});
					}
				});
			} else {
				this.$set(item, 'checked', true);
				let arr = item2.recordCheckList;
				let isThrough = true;
				arr.map(i => {
					if (!i.checked) {
						isThrough = false;
					}
				});
				if (isThrough) {
					this.$set(item2, 'concerns', []);
					this.$set(item2, 'isThrough', false);
				}
			}
		}, //event:默认参数,item: 子数据,item2:父数据
		CheckConIdChange(e, item, item2) {
			let me = this;
			if (!item.checked) {
				me.$set(item2, 'opinion', '');
				this.$set(item, 'checked', true);
				let arr = item2.concerns;
				let str = item2.opinion;
				arr.forEach((items, indexs) => {
					if (items.checked) {
						console.log(items);
						str += indexs + 1 + '' + items.opinion + '\n';
					}
				});
				me.$set(item2, 'opinion', str);
			} else {
				this.$set(item, 'checked', false);
				let arr = item2.concerns;
				let isThrough = true;
				arr.map(i => {
					if (i.checked) {
						isThrough = false;
					}
				});
				if (isThrough) {
					this.$set(item2, 'opinion', '');
				}
			}
		},
		ChooseImage(item) {
			uni.chooseImage({
				count: 3, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success: res => {
					console.log(res.tempFilePaths);
					if (item.rectifyImg.length != 0) {
						item.rectifyImg = item.rectifyImg.concat(res.tempFilePaths);
					} else {
						item.rectifyImg = res.tempFilePaths;
					}
				}
			});
		},
		ViewImage(e, item) {
			uni.previewImage({
				urls: item.rectifyImg,
				current: e.currentTarget.dataset.url
			});
		},
		DelImg(e, item) {
			uni.showModal({
				title: '注意',
				content: '是否删除该图片？',
				cancelText: '再看看',
				confirmText: '再见',
				success: res => {
					if (res.confirm) {
						item.rectifyImg.splice(e.currentTarget.dataset.index, 1);
					}
				}
			});
		},
		IsCard(e, item) {
			this.$set(this, 'isAdd', !e.detail.value);
			this.$set(item, 'isCard', e.detail.value);
			/* this.isCard = e.detail.value */
		},
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
			basic
				.projectCheckList()
				.then(res => {
					if (res.flag) {
						me.$set(me, 'projectCheckList', res.data);
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
			if (me.winForm.checkId.length <= 0) {
				return uni.showToast({
					icon: 'none',
					title: '请选择检查项目！'
				});
			}
			if (me.winForm.checkStaff == '' || typeof this.winForm.checkStaff == 'undefined') {
				return uni.showToast({
					icon: 'none',
					title: '请选择人员！'
				});
			}

			let checkList = me.winForm.checkId;
			let recordCheckList = [];
			checkList.forEach((item, index) => {
				this.projectCheckList.forEach((item2, index) => {
					if (item == item2.checkId) {
						recordCheckList.push({
							checkId: item2.checkId.toString(),
							checkName: item2.checkName,
							typeId: item2.typeId,
							qualifiedStatus: 0,
							checked: true
						});
					}
				});
			});
			me.cuIList.push({
				isCard: true,
				rectifyImg: [],
				isThrough: false,
				planId: me.planId,
				concerns: '',
				checkStaff: me.winForm.checkStaff,
				clockLocation: me.winForm.clockLocation,
				clockTime: me.winForm.clockTime,
				checkStaffName: me.winForm.checkStaffName,
				recordDate: me.getDay('', 0).date,
				recordCheckList: recordCheckList
			});
			console.log(me.cuIList);
			me.modalName2 = null;
		},
		saveData() {
			if (this.cuIList.length > 0) {
				uni.$off('recordClockIn');
				let list = JSON.parse(JSON.stringify(this.cuIList));
				let me = this;
				let rectifyImg = [];
				delete list[0].rectifyImg;
				if (me.cuIList[0].rectifyImg.length > 0) {
					me.isClick = true;
					for (let i = 0; i < me.cuIList[0].rectifyImg.length; i++) {
						const uploadTask = uni.uploadFile({
							url: service.getUrls().url + 'file/imgUpload',
							filePath: me.cuIList[0].rectifyImg[i],
							name: 'imgS',
							header: {
								Authorization: this.$store.state.token
							},
							success: function(uploadFileRes) {
								let data = JSON.parse(uploadFileRes.data);
								if (data.flag) {
									rectifyImg.push(data.data);
									console.log(rectifyImg);
									if (i + 1 == me.cuIList[0].rectifyImg.length) {
										let concernsData = [];
										list[0].concerns.forEach((items, indexs) => {
											if (items.checked) {
												concernsData.push(items.concerns);
											}
										});
										list[0].concerns = concernsData.toString();
										list[0].concernsImg = rectifyImg.toString();
										console.log(list[0]);
										basic
											.pollingRecordAdd(list[0])
											.then(res => {
												if (res.flag) {
													uni.$emit('handleBack', { planId: me.planId, deptName: me.deptName, isback: true });
													uni.showToast({
														icon: 'success',
														title: res.msg
													});
													uni.navigateBack({
														delta: 2,
														url: '../component/polling'
													});
													/* let imgs = me.cuIList[0].rectifyImg.map((value, index) => {
													return {
														name: 'imgS',
														uri: value
													};
												}); */
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
							me.percent = reso.progress;
						});
					}
				} else {
					let concernsData = [];
					list[0].concerns.forEach((items, indexs) => {
						if (items.checked) {
							concernsData.push(items.concerns);
						}
					});
					list[0].concerns = concernsData.toString();
					basic
						.pollingRecordAdd(list[0])
						.then(res => {
							if (res.flag) {
								uni.$emit('handleBack', { planId: me.planId, deptName: me.deptName, isback: true });
								uni.showToast({
									icon: 'success',
									title: res.msg
								});
								uni.navigateBack({
									delta: 2,
									url: '../component/polling'
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

					/* uni.showToast({
						icon: 'none',
						title: '请选择图片'
					}); */
				}
			}
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
		hideModal(e) {
			this.modalName2 = null;
			this.isFab = true;
		},
		checkListChange(val) {
			this.winForm.checkId = val;
		},
		userListChange(val) {
			let me = this;
			this.winForm.checkStaff = val;
			this.userList.forEach((item, index) => {
				if (item.uid == val) {
					me.winForm.checkStaffName = item.username;
				}
			});
		},

		fabClick() {
			var that = this;
			this.winForm = {
				checkId: [],
				checkStaff: '',
				clockLocation: that.winForm.clockLocation,
				clockTime: that.winForm.clockTime
			};
			that.modalName2 = 'Modal';
			/* that.cuIList.push({
				userId: '',
				isCard: true,
				dispatchNum: 0
			}); */
			that.isFab = false;
		}
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
.cu-list.menu-avatar > .cu-item .action {
	width: auto !important;
}
.action,
.content {
	font-size: 13px !important;
}
.cu-item .content {
	width: calc(100% - 35px) !important;
	position: inherit !important;
}
.ruidata {
	font-size: 13px;
	height: 7vw !important;
}
.cu-bar {
	min-height: 30px;
}
.cu-list.menu-avatar > .cu-item .action {
	width: auto !important;
}
/* .page {
		height: calc(100vh - 320upx);
	} */
.nav-title::first-letter {
	font-size: 16px;
	margin-right: 2px;
}
</style>
