'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('ChockIn_list')
	//event为客户端上传的参数
	console.log('event : ' + event)
	let res = await collection.add({
		ChockInPosition: event.ChockInPosition,
		PositionType: event.PositionType,
		Remark: event.Remark,
		PhotoUrl: event.PhotoUrl,
		ChockInTime: new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/,
			'')
	});

	//返回数据给客户端
	return res
};
