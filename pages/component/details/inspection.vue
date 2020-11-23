<template>
	<view>
		<loading :loadModal="loadModal"></loading>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">巡检登记</block>
		</cu-custom>
		<uni-fab :pattern="pattern" :horizontal="horizontal" :vertical="vertical" cuIcon="add" :popMenu="popMenu" distable :direction="direction" @fabClick="fabClick"></uni-fab>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<view v-for="(item, index) in cuIList" :key="index" style="margin-top: 10px;">
				<view class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="cuIcon-titles text-orange"></text> 检查项目
					</view>
					<view class="action" >
						<switch :class="item.isCard?'checked':''" :checked="item.isCard?true:false" @change="IsCard($event, item)"></switch>
					</view>
				</view>
				<view class="cu-card no-card case">
					<view class="cu-item shadow">
						<!-- <view class="image">
							<image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg"
							 mode="widthFix"></image>
							<view class="cu-tag bg-blue">史诗</view>
							<view class="cu-bar bg-shadeBottom"> <text class="text-cut">我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。</text></view>
						</view> -->
						<view class="cu-list menu-avatar">
							<view class="cu-item" >
								<view class="cu-avatar round lg" style="background-image:url(../../static/OK.png);"></view>
								<view class="content flex-sub">
									<view class="text-grey">安全检查</view>
									<view class="text-gray text-sm flex justify-between">
										2020-10-10 10:10:10
										<!-- <view class="text-gray text-sm">
											<text class="cuIcon-attentionfill margin-lr-xs"></text> 10
											<text class="cuIcon-appreciatefill margin-lr-xs"></text> 20
											<text class="cuIcon-messagefill margin-lr-xs"></text> 30
										</view> -->
									</view>
								</view>
								<view @tap="unfoldSetting" v-show='isAdd' style="position: absolute;" class="action">
									<text class="cuIcon-add text-red"  style="font-size: 21px;" ></text>
								</view>
								<view @tap="closeSetting" v-show='isClose' style="position: absolute;" class="action">
									<text class="cuIcon-close text-red"  style="font-size: 21px;" ></text>
								</view>
							</view>
							<view v-show='isThrough' class="cu-list menu">
								<view class="cu-item" style="height: 30px;">
									<view  class="content padding-sm" style="left: 0;">
										<view>
											<text class="cuIcon-text text-blue margin-right-xs"></text> 消防</view>
									</view>
									<view class="action">
										<checkbox-group class="block" @change="CheckboxChange">
										<checkbox class='round blue' :class="checked?'checked':''" :checked="checked?true:false"
										 value="C"></checkbox>
										 </checkbox-group>
									</view>
								</view>
								<view class="cu-item" style="height: 30px;">
									<view  class="content padding-sm" style="left: 0;">
										<view>
											<text class="cuIcon-text text-blue margin-right-xs"></text> 水电</view>
									</view>
									<view class="action">
										<checkbox-group class="block" @change="CheckboxChange">
										<checkbox class='round blue' :class="checked?'checked':''" :checked="checked?true:false"
										 value="C"></checkbox>
										 </checkbox-group>
									</view>
								</view>
							</view>
							<view v-show='isThrough' class="cu-form-group align-start">
								<view class="title">隐患问题</view>
								<textarea maxlength="-1" :disabled="modalName!=null" @input="textareaBInput" placeholder="隐患问题"></textarea>
							</view>
							<view v-show='isThrough' class="cu-bar bg-white">
								<view class="action">
									隐患图片
								</view>
								<view class="action">
									{{imgList.length}}/4
								</view>
							</view>
							<view v-show='isThrough' class="cu-form-group">
								<view class="grid col-4 grid-square flex-sub">
									<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
									 <image :src="imgList[index]" mode="aspectFill"></image>
										<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
											<text class='cuIcon-close'></text>
										</view>
									</view>
									<view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
										<text class='cuIcon-cameraadd'></text>
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
			pageHeight: 0,
			isOrder: false,
			isDis: false,
			onoff: true,
			isClick: false,
			isClose: false,
			isThrough: false, //是否展示明细
			isAdd: false, // 是否展示“+”号
			loadModal: false,
			pickerVal: null,
			modalName: null,
			modalName2: null,
			gridCol: 3,
			skin: false,
			checked: true,
			imgList: [],
			listTouchStart: 0,
			listTouchDirection: null,
			horizontal: 'right',
			vertical: 'bottom',
			popMenu: false,
			direction: 'horizontal',
			pattern: {
				color: '#7A7E83',
				backgroundColor: '#fff',
				selectedColor: '#007AFF',
				buttonColor: '#007AFF'
			},
			isCard: false,
			cuIList: [],
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
					if (res.flag) {
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
					console.log(res.windowHeight)
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
		unfoldSetting(){
			this.$set(this,'isThrough', true)
			this.$set(this,'isClose', true)
			this.$set(this,'isAdd', false)
		}, 
		closeSetting(){
			this.$set(this,'isThrough', false)
			this.$set(this,'isClose', false)
			this.$set(this,'isAdd', true)
		},
		CheckboxChange(e){
			if(this.checked){
				this.$set(this,'checked', false)
			}else{
				this.$set(this,'checked', true)
			}
		},
		ChooseImage() {
			uni.chooseImage({
				count: 4, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: (res) => {
					if (this.imgList.length != 0) {
						this.imgList = this.imgList.concat(res.tempFilePaths)
					} else {
						this.imgList = res.tempFilePaths
					}
				}
			});
		},
		ViewImage(e) {
			uni.previewImage({
				urls: this.imgList,
				current: e.currentTarget.dataset.url
			});
		},
		DelImg(e) {
			uni.showModal({
				title: '召唤师',
				content: '确定要删除这段回忆吗？',
				cancelText: '再看看',
				confirmText: '再见',
				success: res => {
					if (res.confirm) {
						this.imgList.splice(e.currentTarget.dataset.index, 1)
					}
				}
			})
		},
		IsCard(e,item) {
			this.$set(this, 'isAdd' , !e.detail.value)
			this.$set(item, 'isCard' , e.detail.value)
			/* this.isCard = e.detail.value */
		},
		initMain() {
			const me = this;
			this.form.workDate = this.getDay('', 0).date;
			basic
				.getDeptList({})
				.then(res => {
					if (res.flag) {
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
					if (res.flag) {
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
					if (res.flag) {
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
		fabClick() {
			var that = this;
			that.cuIList.push({
				userId: '',
				isCard: true,
				dispatchNum: 0
			});
			console.log(that.cuIList);
		}, // ListTouch触摸开始
		ListTouchStart(e) {
			this.listTouchStart = e.touches[0].pageX;
		},

		// ListTouch计算方向
		ListTouchMove(e) {
			this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left';
		},

		// ListTouch计算滚动
		ListTouchEnd(e) {
			if (this.listTouchDirection == 'left') {
				this.modalName = e.currentTarget.dataset.target;
			} else {
				this.modalName = null;
			}
			this.listTouchDirection = null;
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
