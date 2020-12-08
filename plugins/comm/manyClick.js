// 处理多次点击
function manyCk(fn) {
    let that = this;
	if(typeof(that.onoff) == "undefined"){
		that.onoff = true
	}
   if (that.onoff) {
        that.onoff = false;
		fn();
        setTimeout(function () {
            that.onoff = true;
        }, 500)
    } else {
		that.onoff = false;
		alert('请不要频繁点击')
    }
}
export {
    manyCk
}