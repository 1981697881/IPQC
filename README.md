# uniCloud定位打卡


基于 uniCloud + uniapp 的 serverless 简单的定位打卡demo

### 本demo简单说明
~~~
1.需在 manifest.json 微信小程序中授权  微信接口描述 
"permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    }
  }
  
 2.需要腾讯地图key申请，官网https://lbs.qq.com/
 3.manifest.json中配置上自己的小程序的 appid
 4.本人只在微信小程序模式下简单开发,并未考虑其他端兼容性，暂且只支持微信小程序




