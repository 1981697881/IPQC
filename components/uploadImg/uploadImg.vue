<template>
	<view class="img-content">
		<view class="uploadImg-title">图片上传</view>
		<view class="uploadImg-box">
			<view class="uploadImg">
				<view class="img-box" v-for="(items, index) in oldImgsArry" :key="index" @click="yulan_img(items.imgUrl)">
					<image class="img" :src="items.imgUrl" mode=""></image>
					<image class="img_del" src="../../static/del.png" mode="" v-show="items.showCancel" @click.stop="cancel(items.imgUrl)"></image>
				</view>
				<view class="img-box paizhao" @click="paizhao()" v-if="!(oldImgsArry.length === 4)"><image class="img" src="../../static/photo.png" mode=""></image></view>
			</view>
			<button v-show="uploadBtnShow" class="uploadImg-btn" @click="upload_img()" type="primary" size="mini">上传图片</button>
		</view>
	</view>
</template>

<script>
export default {
	props: {},
	data() {
		return {
			imgsArry: [], //图片保存数组
			oldImgsArry: [], //旧的图片保存数组
			imgFilesDetailArry: [], //上传成功图片信息数组
			uploadBtnShow: false, //是否显示上传图片按钮
			imgCount: 4 //图片选择默认只能选择4张
		};
	},
	watch: {
		//判断全部图片上传成功则隐藏上传按钮（如果有一张没上传成功则不隐藏）
		imgsArry(data) {
			this.uploadBtnShow=data.length===0?false:true
		}
	},
	methods: {
		//拍照
		paizhao() {
			this.imgCount = parseInt(4 - this.oldImgsArry.length);
			uni.chooseImage({
				count: this.imgCount,
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['camera'],
				success: res => {
					let newImgArray = {};
					for (var i = 0; i < res.tempFilePaths.length; i++) {
						if (parseInt(this.imgsArry.length + 1) > 4) {
							uni.showToast({
								title: '上传图片不能大于4张',
								icon: 'none'
							});
						} else {
							(newImgArray = {
								showCancel: true,
								imgUrl: res.tempFilePaths[i]
							}),
								this.imgsArry.push(newImgArray);
							this.oldImgsArry.push(newImgArray);
						}
					}
				}
			});
		},

		// 图片预览
		yulan_img(imgArray) {
			var imagsArray = [];
			imagsArray.push(imgArray);
			uni.previewImage({
				urls: imagsArray
			});
		},

		// 删除图片
		cancel(val) {
			this.removeArrayVal(this.imgsArry, val);
			this.removeArrayVal(this.oldImgsArry, val);
		},

		//删除数组中指定的元素
		removeArrayVal(array, val) {
			let newArray;
			for (let i = 0; i < array.length; i++) {
				if (array[i].imgUrl.toString() === val) {
					array.splice(i, 1);
					break;
				}
			}
		},

		//上传图片函数
		uploadImg(i) {
			return new Promise(resolve => {
				uniCloud.uploadFile({
					filePath: this.imgsArry[i].imgUrl,
					cloudPath: 'aa.jpg',
					success(uploadFileRes) {
						resolve(uploadFileRes);
					},
					fail() {},
					complete() {}
				});
			});
		},

		//上传图片
		async upload_img() {
			this.uploadBtnShow = false;
			uni.showLoading({
				title: '上传图片中'
			});
			for (let i = 0; i < this.imgsArry.length; i++) {
				let res = await this.uploadImg(i);

				this.imgsArry[i].showCancel = false; //修改红色叉叉的状态(隐藏)
				this.imgFilesDetailArry.push(res.fileID);
				if (i === this.imgsArry.length - 1) {
					uni.showToast({
						title: '上传成功',
						icon: 'none'
					});
					this.$emit('click', this.imgFilesDetailArry); //将图片信息发送给父组件
					this.imgsArry = []; //上传成功清空图片数组
					// this.imgFilesDetailArry = []; //上传成功清空图片信息
					setTimeout(function() {
						uni.hideLoading();
					}, 300);
				}
			}
		}
	}
};
</script>

<style lang="scss">
.img-content {
	padding: 10rpx 0;

	.uploadImg-title {
		font-size: 28rpx;
		color: #007aff;
		margin-bottom: 15rpx;
	}

	.uploadImg-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;

		.shade {
			position: absolute;
			left: 0;
			right: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 50;

			.uploadLoding {
				width: 50rpx;
				height: 50rpx;
			}
		}

		.uploadImg {
			display: flex;
			align-items: center;
			flex-wrap: wrap;

			.img-box {
				width: 125rpx;
				height: 125rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 10rpx;
				margin-right: 15rpx;
				position: relative;

				.img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
				.img_del {
					width: 60rpx;
					height: 40rpx;
					position: relative;
					top: -45rpx;
					left: -28rpx;
				}
				.cancel {
					position: absolute;
					right: 0;
					bottom: 0;
					color: red;
					font-size: 40rpx;
					z-index: 4;
				}

				&.paizhao {
					font-size: 30rpx;
					border: 2rpx dashed #d5dde8;
					box-sizing: border-box;
					.img {
						width: 100rpx;
						height: 100rpx;
					}
				}
			}
		}

		.uploadImg-btn {
			margin-top: 20rpx;
			margin-bottom: 30rpx;
		}
	}
}
</style>
