<template>
	<view>
		<loading :loadModal="loadModal"></loading>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">完成反馈</block>
			<!-- <block slot="right"><text @tap="$manyCk(handleShare)" class="cuIcon-forward margin-right-xs">分享</text></block> -->
		</cu-custom>
		<view><progress :percent="percent" stroke-width="10"></progress></view>
		<view class="cu-modal" style="z-index: 1111" :class="modalName2 == 'Modal' ? 'show' : ''">
			<view class="cu-dialog bg-white" style="height: 65%;">
				<view class="cu-bar justify-end margin-lr-xs" style="height: 70upx;border-bottom: 1px solid #CCCCCC;">
					<view class="content text-sl">签名确认</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="signature" v-show="showCanvas">
					<canvas class="mycanvas" canvas-id="mycanvas" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"></canvas>
					<view class="footer">
						<view class="cu-btn bg-green shadow-blur round lg" @click="finish">保存</view>
						<view class="cu-btn bg-grey shadow-blur round lg" @click="clear">清除</view>
						<!-- <view class="close" @click="close">关闭</view> -->
					</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<!-- <view v-for="(item, index) in cuIList" :key="index" style="margin-top: 10px;">
				<view class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="cuIcon-titles text-cyan"></text> 单号：123
					</view>
					<view class="action" >
						2020-10-01
					</view>
				</view>
				<view class="cu-card no-card case">
					<view class="cu-item shadow">
						<view class="cu-list menu-avatar">
							<view class="cu-item">
								<view class="action flex-sub">
									<view class="text-gray text-sm flex justify-between">
										隐患问题：
										<view class="text-gray text-sm">
											<text class="cuIcon-people margin-lr-xs"></text> A先生
										</view>
									</view><view class="text-gray text-sm flex justify-between">
										整改内容：
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
								<button class="cu-btn bg-purple round sm" @tap="handlerOpin">整改意见</button>
							</view>
							<view class="action" >
								<button class="cu-btn bg-pink round sm" @tap="handlerSign">签名确认</button>
							</view>
						</view>
					</view>
				</view>
			</view> -->
			<view v-for="(item, index) in cuIList" :key="index" style="margin-top: 10px;">
				<view class="cu-list menu-avatar">
					<view class="cu-item" style="width: 100%;margin-top: 2px;height: auto;">
						<view style="clear: both;width: 100%;">
							<view class="cu-bar bg-white solid-bottom">
								<view class="action">
									<text class="cuIcon-titles text-orange"></text>
									被检人员:{{ item.checkStaff }}
								</view>
								<view class="action">登记日期：{{ item.recordDate }}</view>
							</view>
							<view class="cu-bar bg-white solid-bottom">
								<view class="action">
									<text class="cuIcon-titles text-orange"></text>
									陪同人员:{{ item.escortName }}
								</view>
							</view><view class="cu-bar bg-white solid-bottom">
								<view class="action">
									<text class="cuIcon-titles text-orange"></text>
									检查人员:{{ item.inspector }}
								</view>
							</view>
							<view class="cu-card no-card case">
								<view class="cu-item shadow">
									<view class="cu-list menu-avatar">
										<view class="cu-list menu">
											<view v-for="(item2, index2) in item.recordCheckList" :key="index2" class="cu-item" style="height: 30px;">
												<view class="content padding-sm" style="left: 0;">
													<view>
														<text class="cuIcon-text text-blue margin-right-xs"></text>
														{{ item2.checkName }}
													</view>
												</view>
											</view>
										</view>
										<view class="cu-form-group align-start">
											<view class="title">隐患问题</view>
											<textarea v-model="item.concerns" maxlength="-1" :disabled="modalName != null" placeholder="隐患问题"></textarea>
										</view>
										<view class="cu-bar bg-white">
											<view class="action">隐患图片</view>
											<view class="action">{{ item.concernsImg.length }}/3</view>
										</view>
										<view class="cu-form-group">
											<view class="grid col-3 grid-square flex-sub">
												<view
													class="bg-img"
													v-for="(item3, index3) in item.concernsImg"
													:key="index3"
													@tap="ViewImage($event, item)"
													:data-url="item.concernsImg[index3]"
												>
													<image :src="item.concernsImg[index3]" mode="aspectFill"></image>
													<view class="cu-tag bg-red" @tap.stop="DelImg($event, item)" :data-index="index3"><text class="cuIcon-close"></text></view>
												</view>
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
					<button v-if="!isCommit" :disabled="isClick" class="cu-btn bg-green shadow-blur round lg" style="width: 40%;" @tap="$manyCk(onCanvs)">提交</button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
import basic from '@/api/basic';
import service from '@/service.js';
import loading from '@/components/loading';
var x = 20;
var y = 20;
export default {
	components: { loading },
	data() {
		return {
			percent: 0,
			isCommit: true,
			imageUrl: service.getUrls().url,
			showCanvas: false,
			ctx: '', //绘图图像
			points: [], //路径点集合
			signature: '',
			pageHeight: 0,
			onoff: true,
			isClick: false,
			loadModal: false,
			pickerVal: null,
			modalName: null,
			modalName2: null,
			gridCol: 3,
			cuIList: []
		};
	},
	onLoad: function(option) {
		let me = this;
		me.imageUrl = me.imageUrl.replace('/web', '');
		if (JSON.stringify(option) != '{}') {
			this.isOrder = true;
			this.planId = option.planId;
			if (option.isCommit == 'true') {
				this.isCommit = true;
			} else {
				this.isCommit = false;
			}
			this.deptName = option.deptName;
			basic
				.pollingRecordByPlanId(option.planId)
				.then(res => {
					if (res.flag) {
						if (res.data != null) {
							res.data.concernsImg = res.data.concernsImg != '' ? res.data.concernsImg.split(',') : [];
							let concerns = res.data.concerns.split(',');
							let str = '';
							for (let i = 0; i < res.data.concernsImg.length; i++) {
								res.data.concernsImg[i] = me.imageUrl + 'uploadFiles/image/' + res.data.concernsImg[i];
							}
							for (let i = 0; i < concerns.length; i++) {
								str += i + 1 + '' + concerns[i] + '\n';
							}
							res.data.concerns = str;
							me.cuIList.push(res.data);
						} else {
							me.isClick = true;
						}
						console.log(res.data);
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
		onCanvs() {
			this.modalName2 = 'Modal';
			this.createCanvas();
		},
		//关闭并清空画布
		close: function() {
			this.showCanvas = false;
			this.clear();
		},
		//创建并显示画布
		createCanvas: function() {
			this.showCanvas = true;
			this.ctx = uni.createCanvasContext('mycanvas', this); //创建绘图对象
			//设置画笔样式
			this.ctx.lineWidth = 4;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
		},
		//触摸开始，获取到起点
		touchstart: function(e) {
			let startX = e.changedTouches[0].x;
			let startY = e.changedTouches[0].y;
			let startPoint = { X: startX, Y: startY };
			this.points.push(startPoint);
			//每次触摸开始，开启新的路径
			this.ctx.beginPath();
		},

		//触摸移动，获取到路径点
		touchmove: function(e) {
			let moveX = e.changedTouches[0].x;
			let moveY = e.changedTouches[0].y;
			let movePoint = { X: moveX, Y: moveY };
			this.points.push(movePoint); //存点
			let len = this.points.length;
			if (len >= 2) {
				this.draw(); //绘制路径
			}
		},

		// 触摸结束，将未绘制的点清空防止对后续路径产生干扰
		touchend: function() {
			this.points = [];
		},

		/* ***********************************************
			#   绘制笔迹
			#	1.为保证笔迹实时显示，必须在移动的同时绘制笔迹
			#	2.为保证笔迹连续，每次从路径集合中区两个点作为起点（moveTo）和终点(lineTo)
			#	3.将上一次的终点作为下一次绘制的起点（即清除第一个点）
			************************************************ */
		draw: function() {
			let point1 = this.points[0];
			let point2 = this.points[1];
			this.points.shift();
			this.ctx.moveTo(point1.X, point1.Y);
			this.ctx.lineTo(point2.X, point2.Y);
			this.ctx.stroke();
			this.ctx.draw(true);
		},

		//清空画布
		clear: function() {
			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					let canvasw = res.windowWidth;
					let canvash = res.windowHeight;
					that.ctx.clearRect(0, 0, canvasw, canvash);
					that.ctx.draw(true);
				}
			});
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
		handleShare() {
			console.log(123);
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
		doHandleMonth(month) {
			var m = month;
			if (month.toString().length == 1) {
				m = '0' + month;
			}
			return m;
		},
		//完成绘画并保存到本地
		finish: function() {
			let that = this;
			let concernsImg = [];
			let signature = '';
			if (that.cuIList.length > 0) {
				uni.canvasToTempFilePath({
					canvasId: 'mycanvas',
					success: function(res) {
						let cutImg = that.cuIList[0].concernsImg;
						if (cutImg.length != 0) {
							cutImg = cutImg.concat(res.tempFilePath);
						} else {
							cutImg .push(res.tempFilePath);
						}
						for (let i = 0; i < cutImg.length; i++) {
							const uploadTask = uni.uploadFile({
								url: service.getUrls().url + 'file/imgUpload',
								filePath: cutImg[i],
								name: 'imgS',
								header: {
									Authorization: that.$store.state.token
								},
								success: function(uploadFileRes) {
									let data = JSON.parse(uploadFileRes.data);
									if (data.flag) {
										if (i + 1 == cutImg.length) {
											signature = data.data;
											that.isClick = true;
											let list = that.cuIList[0];
											basic
												.completeRectify({
													recordId: list.recordId,
													rectifyFinishDate: that.getDay('', 0).date,
													concernsImg: concernsImg.toString(),
													signature: signature
												})
												.then(reso => {
													if (reso.flag) {
														setTimeout(function() {
															uni.$emit('handleBack', { planId: that.planId, deptName: that.deptName, isback: true });
															uni.navigateBack({
																url: '../component/polling'
															});
														}, 500);
														uni.showToast({
															icon: 'success',
															title: reso.msg
														});
													}
												})
												.catch(err => {
													uni.showToast({
														icon: 'none',
														title: err.msg
													});
													that.isClick = false;
												});
										} else {
											concernsImg.push(data.data);
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
								console.log(reso);
								that.percent = reso.progress;
							});
						}
					
					},
					fail: function(errs) {
						console.log('生成图片出错:', JSON.stringify(errs));
						uni.hideLoading();
						/* uni.showModal({
							title: '绘制小程序二维码失败',
							content: '请搜索""小程序,并在小程序观看课程',
							showCancel: false
						}); */
					}
				});
			}
			//上传到服务器
			/* that.api.uploadFile({
				url: 'user/upload/one',
				filePath: res.tempFilePath,
				name: 'file',
				success: uploadFileRes => {
					console.log(uploadFileRes);
					that.signature = uploadFileRes.data.url;
					that.clear();
					that.showCanvas = false;
				}
			}); */
			//保存到本地
			/* 
			let path = res.tempFilePath;
			uni.saveImageToPhotosAlbum({
				filePath:path,
			}) */
		},
		ChooseImage(item) {
			uni.chooseImage({
				count: 3, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: res => {
					if (item.concernsImg.length != 0) {
						item.concernsImg = item.concernsImg.concat(res.tempFilePaths);
					} else {
						item.concernsImg = res.tempFilePaths;
					}
				}
			});
		},
		handlerOpin() {
			uni.navigateTo({
				url: '../details/opinion'
			});
		},
		handlerSign() {
			uni.navigateTo({
				url: '../details/endorse'
			});
		},
		// 预览图片多张
		previewImage() {
			let imgList = ['https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg', 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg'];
			uni.previewImage({
				current: imgList.length,
				urls: imgList
			});
		},
		hideModal(e) {
			this.modalName2 = null;
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
.signature {
	position: relative;
	z-index: 999;
	width: auto;
}
.container {
	padding: 20rpx 0 120rpx 0;
	box-sizing: border-box;
}
.title {
	height: 50upx;
	line-height: 50upx;
	font-size: 16px;
}
.mycanvas {
	width: 100%;
	height: calc(100vh - 52vh);
	background-color: #ececec;
}
.footer {
	font-size: 14px;
	height: 120upx;
	display: flex;
	justify-content: space-around;
	align-items: center;
}
.left,
.right,
.close {
	line-height: 100upx;
	height: 100upx;
	width: 220upx;
	text-align: center;
	font-weight: bold;
	color: white;
	border-radius: 5upx;
}
.left {
	background: #007aff;
}
.right {
	background: orange;
}
.close {
	background: #a3a3a3;
}
</style>
