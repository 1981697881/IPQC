<template>
	<view class="lwming_ClockIn">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">打卡</block>
			<!-- <block slot="right">
				<navigator :url="'/pages/TimeRecord/TimeRecord'"><text class="cuIcon-remind">打卡记录</text></navigator>
			</block> -->
		</cu-custom>
		<view class="ClockIn_conten">
			<!-- <view class="header">
				<view class="header_Type" @click="Tabs_Type" :class="{ choose: activeType === false }">公司打卡</view>
				<view class="header_Type" @click="Tabs_Type" :class="{ choose: activeType === true }">外出打卡</view>
			</view> -->
			<view class="container">
				<!-- 公司打卡 -->
				<view class="item_In" v-if="activeType === false">
					<view class="address">{{ ClockInObj.address }}</view>
					<!-- <view class="address">{{ lng_lug }}</view> -->
					<image class="img" :src="IS_Range === true ? '../../static/OK.png' : '../../static/warn.png'" mode=""></image>
					<view class="IS_Range" :class="{ IS_Range_No: IS_Range === false }">{{ IS_Range_Content }}</view>
				</view>
				<!-- 出差打卡 -->
				<view class="item_In" v-else>
					<image class="img" src="../../static/map.png" mode=""></image>
					<view class="address" @click="GetChooseLocation">{{ ClockInObj.street }} >></view>
					<view class="address">{{ ClockInObj.Details }}</view>
					<template v-if="conBoll">
						<view class="Add_Notes" @click="AddRemarks">添加备注...</view>
					</template>
					<template v-else>
						<view class="contet_box" @click="AddRemarks">
							<view class="txt">{{ keycode }}</view>
							<view class="img_box_right"><image v-for="(item, index) in ImgArr" :key="index" class="image_" :src="item" mode=""></image></view>
						</view>
					</template>
				</view>

				<!-- 打卡按钮 -->
				<view class="item_Button" :class="[ClockInObj.IsSuccess ? 'item_Button_Click' : '']">
					<view class="ring" @click="Submit">
						<view class="time">{{ time }}</view>
						<view class="time">打卡</view>
					</view>
				</view>
			</view>
		</view>

		<!-- <map :latitude="lat_current" :longitude="lng_current" :markers="covers"></map> -->

		<!-- 备注拍照 -->
		<view class="remarkBigWarp" v-show="IsChange">
			<view class="remarkWarp">
				<view class="remarkWarpBox">
					<textarea value="" placeholder="填写备注" class="textTile" v-model="keycode" :auto-focus="autoBool" />
					<view class="photoBox"><uploadImg @click="getImgList"></uploadImg></view>
				</view>
				<view class="btnWrap">
					<view class="cancel" style="color: #333;" @click="quxiaoFunc">取消</view>
					<view class="cancel" @click="quedingFunc">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uploadImg from '@/components/uploadImg/uploadImg.vue';
import basic from '@/api/basic';
import amap from '@/jsSdk/amap-wx.js';
import ldSelect from '@/components/ld-select/ld-select.vue';
export default {
	components: { uploadImg, ldSelect },
	data() {
		return {
			amapPlugin: null,
			mapKey: '24a00acc49bc8b7e4c70ae19ae4c7231',
			form: {},
			isClick: false,
			IsChange: false, //控制“添加备注”
			autoBool: false, //textarea自动聚焦
			keycode: '', //输入框的值
			conBoll: true,
			ImgArr: [],
			userList: [],
			covers: [],
			activeType: false,
			time: '',
			lng_lug: '',
			ClockInObj: {
				street: '',
				Details: '',
				IsSuccess: false,
				address: '' //打卡类型
			},
			lat_current: 0, //当前位置
			lng_current: 0, //当前位置
			lat_In: 0, //设定公司打卡中心点
			lng_In: 0, //设定公司打卡中心点
			Distance_In: 0.002, //公司打卡半径范围
			Distance_Out: 0.005, //外出打卡半径范围
			IS_Range: true, //是否在范围内
			IS_Range_Out: true, //外出打卡是否在范围内
			IS_Range_Content: '你已在打卡范围内'
		};
	},

	onShow() {
		/* uniCloud
			.callFunction({
				name: 'ClockIn-get-location'
			})
			.then(res => {
				if (res.result.length > 0) {
					let result = res.result[0];
					this.lng_In = result.Longitude;
					this.lat_In = result.Latitude;
					this.Distance_In = result.Distance_In;
					this.Distance_Out = result.Distance_Out;
					this.getMaxLongitudeLatitude();
				}
			}); */
		// 获取当前时间
		//setInterval(() => {
		var date = new Date();
		var hour = date.getHours();
		var minute = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
		this.time = hour + ':' + minute;
		//}, 1000);
	},
	onLoad(option) {
		//获取设定好的地址坐标（经纬度）
		uni.getLocation({
			type: 'gcj02',
			success: res => {
				this.lng_lug = res.longitude+','+res.latitude
				this.lng_In = res.longitude + 0.005100;
				this.lat_In = res.latitude - 0.002200;
				this.Distance_In = 0.005;
				this.Distance_Out = 0.005;
				this.GetCurrentAddress();
			}
		});
		if (JSON.stringify(option) != '{}') {
			this.form.planId = option.planId;
			this.form.deptName = option.deptName;
			this.form.isType = option.isType;
			this.form.isExist = option.isExist;
			this.form.isCommit = option.isCommit;
			this.form.isOrder = option.isOrder;
			this.form.recordId = option.recordId;
			this.form.inspector = option.inspector;
		}
		this.initMain();
	},
	methods: {
		initMain() {
			var me = this;
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
			var hour = this.doHandleMonth(today.getHours());
			var minute = this.doHandleMonth(today.getMinutes());
			var second = this.doHandleMonth(today.getSeconds());
			tMonth = this.doHandleMonth(tMonth + 1);
			tDate = this.doHandleMonth(tDate);
			var weeks = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
			var week = weeks[getDay];
			return {
				day: tDate,
				week: week,
				date: tYear + '-' + tMonth + '-' + tDate + ' ' + hour + ':' + minute + ':' + second
			};
		},
		doHandleMonth(month) {
			var m = month;
			if (month.toString().length == 1) {
				m = '0' + month;
			}
			return m;
		},
		Submit() {
			let me = this;
			let type = 0;
			let address = '';
			console.log(this.ClockInObj);
			if (me.isClick) {
				if (this.activeType) {
					//出差打卡
					type = 1;
					address = this.ClockInObj.address;
					if (this.IS_Range_Out === false) {
						this.showToast_Tips('请选择合适的范围打卡', 'none');
						return false;
					}
				} else {
					//公司打卡
					type = 0;
					address = this.ClockInObj.address;
					if (this.IS_Range === false) {
						this.showToast_Tips('你已超出打卡范围', 'none');
						return false;
					}
				}

				this.ClockInObj.IsSuccess = true;
				uni.showLoading({
					title: '打卡中...'
				});

				let obj = {
					ChockInPosition: address, //打卡位置
					PositionType: type, //打卡类型
					Remark: this.keycode,
					PhotoUrl: this.ImgArr
				};

				let rqData = {};
				rqData.planId = this.form.planId;
				rqData.deptName = this.form.deptName;
				this.form.checkStaff != null && this.form.checkStaff != '' ? (rqData.checkStaff = this.form.checkStaff) : null;
				address != null && address != '' ? (rqData.clockLocation = address) : null;
				rqData.clockTime = this.getDay('', 0).date;
				uni.showToast({
					icon: 'success',
					title: '打卡成功'
				});
				if (this.form.isType == 'true') {
					console.log(this.form);
					uni.$emit('recordClockIn', { clockTime: rqData.clockTime, clockLocation: rqData.clockLocation });
					/* uni.$emit('handleBack', { planId: this.form.planId, deptName: this.form.deptName, isback: true }); */
					uni.navigateTo({
						url:
							'../component/details/inspection?planId=' +
							me.form.planId +
							'&deptName=' +
							me.form.deptName +
							'&isExist=' +
							me.form.isExist +
							'&isCommit=' +
							me.form.isCommit +
							'&inspector=' +
							me.form.inspector +
							'&clockTime=' +
							rqData.clockTime +
							'&clockLocation=' +
							rqData.clockLocation
					});
					/* uni.navigateBack({
						url: '../component/polling'
					}); */
				} else {
			
					uni.$emit('handleClockIn', { clockTime: rqData.clockTime, clockLocation: rqData.clockLocation });
					
					uni.navigateTo({
						url:
							'../component/details/feedback?planId=' +
							me.form.planId +
							'&deptName=' +
							me.form.deptName +
							'&recordId=' +
							me.form.recordId +
							'&isOrder=' +
							me.form.isOrder +
							'&clockTime=' +
							rqData.clockTime +
							'&clockLocation=' +
							rqData.clockLocation
					});
				} 
				// 保存打卡数据
				/* uniCloud
					.callFunction({
						name: 'ClockIn-add',
						data: obj
					})
					.then(res => {
						setTimeout(() => {
							this.ClockInObj.IsSuccess = false;
							this.showToast_Tips('打卡成功', 'success');
							uni.hideLoading();
						}, 1500);
					}); */
			} else {
				uni.showToast({
					icon: 'none',
					title: '地址读取中'
				});
			}
		},

		//选择地址
		GetChooseLocation() {
			uni.chooseLocation({
				success: res => {
					this.ClockInObj.street = res.name;
					this.ClockInObj.Details = res.address;
					// this.OutMaxLongitudeLatitude(res);
					this.getMaxLongitudeLatitude(res);
				}
			});
		},

		//拍照传来的图片信息数据
		getImgList(data) {
			this.ImgArr = data;
		},

		//提示
		showToast_Tips(title, icon) {
			uni.showToast({
				title: title,
				duration: 2000,
				icon: icon
			});
		},
		//点击确定
		quedingFunc() {
			if (this.keycode != '') {
				setTimeout(() => {
					this.IsChange = false;
					this.conBoll = false;
				}, 300);
			} else {
				this.showToast_Tips('请输入内容', 'none');
			}
		},

		// 点击取消
		quxiaoFunc() {
			setTimeout(() => {
				this.IsChange = false;
			}, 300);
		},

		//添加备注功能
		AddRemarks() {
			this.IsChange = !this.IsChange;
			this.autoBool = true;
		},

		//获取当前地址
		GetCurrentAddress() {
			uni.showLoading({
				title: '加载中'
			});
			let _this = this;
			/* uni.authorize({
				scope: 'scope.userLocation',
				success() { */
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						success: res => {
							_this.lat_current = res.latitude - 0.002200;
							_this.lng_current = res.longitude + 0.005400;
							_this.getMaxLongitudeLatitude();
							let Position = {
								latitude: res.latitude - 0.002200,
								longitude: res.longitude + 0.005400
							};
							_this.covers.push(Position);
							_this.getLocationName();
						}
					});
				/* }
			}); */
		},
		getLocationName() {
			let _this = this; 
			let URL = 'https://apis.map.qq.com/ws/geocoder/v1/?location=';
			let key = 'OKYBZ-EF4AJ-OJFFM-KJOVL-GFN5S-4MBY3'; //你申请的开发者密钥（Key）  一般放在后台获取过来
			let getAddressUrl = URL + _this.lat_current + ',' + _this.lng_current + `&key=${key}`;
			wx.request({
				url: getAddressUrl,
				success: result => {
					_this.isClick = true;
					let Res_Data = result.data.result;
					_this.ClockInObj.street = Res_Data.address;
					_this.ClockInObj.Details = Res_Data.formatted_addresses.recommend;
					_this.ClockInObj.address = Res_Data.address + '(' + Res_Data.formatted_addresses.recommend + ')';
					setTimeout(() => {
						uni.hideLoading();
					}, 300);
				}
			});
			//高德定位 小程序
			/* this.amapPlugin = new amap.AMapWX({
				key: this.mapKey //该key 是在高德中申请的微信小程序key
			});
			console.log(_this.lat_current + ',' + _this.lng_current,)
			this.amapPlugin.getRegeo({
				type: 'gcj02', //map 组件使用的经纬度是国测局坐标， type 为 gcj02
				location: _this.lng_current + ',' + _this.lat_current, 
				success: function(res) {
					console.log(res)
					_this.isClick = true;
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: res[0].name + '(' + res[0].desc + ')'
					});
					_this.ClockInObj.street = res[0].name;
					_this.ClockInObj.Details = res[0].desc;
					_this.ClockInObj.address = res[0].name + '(' + res[0].desc + ')';
					setTimeout(() => {
						uni.hideLoading();
					}, 300);
				},
				fail: res => {
					console.log(JSON.stringify(res));
				}
			}); */
			//高德定位 Android
			/* let URL = 'https://restapi.amap.com/v3/geocode/regeo';
			let key = 'ef196cee566aac0cbca74a0992733d01'; //你申请的开发者密钥（Key）  一般放在后台获取过来
			wx.request({
				url: URL,
				method: 'GET',
				data: { 
					key: key,
					location: _this.lng_current + ',' + _this.lat_current,
					extensions: 'all'
				},
				success: result => {
					_this.isClick = true;
					console.log(result);
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: _this.lng_current + '(' + _this.lat_current + ')'
					});
					let Res_Data = result.data.regeocode;
					_this.ClockInObj.street = Res_Data.formatted_address;
					_this.ClockInObj.Details = Res_Data.formatted_address;
					_this.ClockInObj.address = Res_Data.formatted_address;
				}
			}); */
		},
		//公司地址范围限制
		getMaxLongitudeLatitude(res) {
			let L = 0,
				T = 0,
				Max_L = 0,
				Max_T = 0;

			if (this.activeType) {
				//公司外出打卡
				L = this.lng_current; //当前经度
				T = this.lat_current; //当前纬度
				if (res !== undefined) {
					Max_L = res.longitude; //选择的位置 中心点
					Max_T = res.latitude; //选择的位置  中心点
				}

				let X_T = Max_T - T;
				let X_L = Max_L - L;
				let X_square = Math.pow(X_T, 2);
				let Y_square = Math.pow(X_L, 2);
				let XY_square = X_square + Y_square;
				let Limit_R = Math.sqrt(XY_square);
				if (Limit_R >= this.Distance_Out) {
					this.IS_Range_Out = false;
					this.showToast_Tips('请选择合适的范围打卡', 'none');
				} else {
					this.IS_Range_Out = true;
				}
			} else {
				//公司地址范围限制
				L = this.lng_current; //当前经度
				T = this.lat_current; //当前纬度
				Max_L = this.lng_In; //选择的位置 中心点
				Max_T = this.lat_In; //选择的位置  中心点
				let X_T = Max_T - T;
				let X_L = Max_L - L;
				let X_square = Math.pow(X_T, 2);
				let Y_square = Math.pow(X_L, 2);
				let XY_square = X_square + Y_square;
				let Limit_R = Math.sqrt(XY_square);
				console.log(Max_L);
				console.log(L);
				if (Limit_R <= this.Distance_In) {
					this.IS_Range = true;
					this.IS_Range_Content = '你已在打卡范围内';
				} else {
					this.IS_Range = false;
					this.IS_Range_Content = '你已超出打卡范围';
				}
			}
		},

		Tabs_Type() {
			this.activeType = !this.activeType;
		}
	}
};
</script>

<style lang="scss">
.lwming_ClockIn {
	height: 100vh;
	position: relative;

	.ClockIn_conten {
		position: absolute;
		width: 100%;
		background-color: #fff;
		z-index: 50;
		opacity: 0.9;
		height: 100vh;
	}
	map {
		position: absolute;
		width: 100%;
		height: 100vh;
		z-index: -50;
	}
	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 15rpx 0;
		&_Type {
			width: 40%;
			font-size: 28rpx;
			color: #333;
			text-align: center;
			position: relative;
			padding-bottom: 25rpx;
			&::before {
				content: '';
				position: absolute;
				left: 0;
				bottom: 0;
				right: 0;
				margin: auto;
				width: 75%;
				height: 3px;
				background-color: #fff;
				transform: scale3d(0, 1, 1);
				transform-origin: center;
				transition: all 0.5s;
			}

			&.choose {
				color: #1890ff;

				&::before {
					transform: scale3d(1, 1, 1);
					background-color: #1890ff;
				}
			}
		}
	}
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 100rpx;
		.item_In {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			.img {
				width: 90rpx;
				height: 90rpx;
				object-fit: cover;
				padding: 30rpx 0;
			}
			.address {
				padding: 8rpx 0;
			}
			.IS_Range {
				font-size: 34upx;
				font-weight: 600;
				padding: 20upx 0;
			}
			.IS_Range_No {
				color: #ff4949;
			}
			.Add_Notes {
				margin-top: 100upx;
				font-size: 26upx;
			}
			.contet_box {
				width: 100%;
				margin: 20rpx auto;
				.txt {
					margin-bottom: 20rpx;
					width: 90%;
					text-align: center;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: #444;
				}
				.img_box_right {
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					.image_ {
						margin: 0 15rpx;
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						object-fit: cover;
					}
				}
			}
		}
		.item_Button {
			width: 200rpx;
			height: 200rpx;
			text-align: center;
			border-radius: 50%;
			margin-top: 40rpx;
			color: #ffffff;
			font-size: 32rpx;
			background-image: linear-gradient(125deg, #e4ffcd, #029fff, #0166ff, #e4ffcd);
			background-size: 400%;
			animation: bganimation 15s infinite;
			display: flex;
			justify-content: center;
			align-items: center;
			@keyframes bganimation {
				0% {
					background-position: 0% 50%;
				}
				50% {
					background-position: 100% 50%;
				}
				100% {
					background-position: 0% 50%;
				}
			}
		}
		.item_Button_Click {
			color: #ffffff;
			background-image: linear-gradient(125deg, #ff4e50, #00c75d, #ff4e50, #e4ffcd);
		}
	}
}

.remarkBigWarp {
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
	top: 0;
	left: 0;
	.remarkWarp {
		width: 90%;
		background-color: #ffffff;
		position: absolute;
		top: 100rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		border-radius: 16rpx;
		.remarkWarpBox {
			width: 90%;
			margin: 0 auto;
			padding: 10rpx 0;
			.textTile {
				width: 100%;
				height: 150rpx;
				caret-color: #4cd964;
			}
			.photoBox {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
			}
		}
		.btnWrap {
			display: flex;
			color: #4cd964;
			width: 100%;
			border-top: 1rpx solid #cccccc;
			.cancel {
				width: 100%;
				text-align: center;
				padding: 20rpx 0;
				font-size: 30rpx;
				letter-spacing: 2rpx;
			}
			.cancel:active {
				background-color: rgba(0, 0, 0, 0.2);
				transition: all 0.2s ease-in;
			}
		}
	}
}
.cu-item {
	float: left;
	width: 50%;
}
.cu-item .content {
	float: left;
}
.cu-list.menu-avatar > .cu-item .content {
	left: 5px;
}
.cu-list.menu-avatar > .cu-item .action {
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
</style>
