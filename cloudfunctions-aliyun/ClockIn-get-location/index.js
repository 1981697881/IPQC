'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('LongitudeLatitude_list')
	//event为客户端上传的参数
	const {data} = await collection.get();
	//返回数据给客户端
	return data
};
