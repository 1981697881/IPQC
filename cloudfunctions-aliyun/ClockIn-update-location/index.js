'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('LongitudeLatitude_list')
	//event为客户端上传的参数
	// console.log('event : ' + event)
	let res = await collection.doc(event._id).update({
		Longitude: event.Longitude,
		Latitude: event.Latitude,
		Distance_In: event.Distance_In,
		Distance_Out: event.Distance_Out,
		address: event.address,
	});

	//返回数据给客户端
	return res
}
