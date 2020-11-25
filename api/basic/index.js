import Request from '@/plugins/request/js/index';
export default {
	//主页-巡检列表
	pollingPlanList(params) {
	    return Request().post('/app/pollingPlanList/'+params.pageNum+'/'+params.pageSize, {
	        header: {
				contentType: 'application/json',
			},
			data: params
	    });
	},//获取人员
	userList() {
	    return Request().get('/user/format', {
			header: {
				accept: '*/*',
			},
	    });
	},//获取检查项目
	projectCheckList(params) {
	    return Request().get('/project-check/format', {
			header: {
				accept: '*/*',
			},
			data: params
	    });
	},//查询登记
	pollingRecordByPlanId(params) {
	    return Request().get('/app/pollingRecordByPlanId/'+params, {
			header: {
				accept: '*/*',
			},
	    });
	},
	//巡检登记
	pollingRecordAdd(params) {
	    return Request().post('/app/pollingRecordAdd', {
	        header: {
				contentType: 'application/json',
			},
			data: params
	    });
	},//反馈登记历史记录
	recordRectifyList(params) {
	    return Request().post('/app/recordRectifyList', {
	        header: {
				contentType: 'application/json',
			},
			data: params
	    });
	},
};
