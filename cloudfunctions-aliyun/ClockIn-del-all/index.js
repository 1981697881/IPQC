'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('ChockIn_list')
	//删除所有打卡记录
	const dbCmd = db.command
	let res = await collection.where({
		_id: dbCmd.exists(true)
	}).remove()
	//返回数据给客户端
	return res
};
