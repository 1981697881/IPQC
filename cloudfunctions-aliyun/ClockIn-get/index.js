'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('ChockIn_list')
	//event为客户端上传的参数
	console.log('event : ' + event)
	let res = await collection.orderBy("_id", "desc").where({
		ChockInTime: new RegExp(event.val),
	}).get()
	//返回数据给客户端
	return res
};
