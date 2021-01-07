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
	},//主页-项目列表
	projectList(params) {
	    return Request().post('/app/projectList/'+params.pageNum+'/'+params.pageSize, {
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
	},//获取项目信息
	projectTypeList() {
	    return Request().get('/project-type/format', {
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
	},//查询问题隐患
	formatListByCheckId(params) {
	    return Request().get('/app/formatListByCheckId/'+params, {
			header: {
				accept: '*/*',
			},
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
	},//巡检登记修改
	pollingRecordUpdate(params) {
	    return Request().put('/polling-record/update', {
	        header: {
				contentType: 'application/json',
			},
			data: params
	    });
	},//添加巡检计划
	addPollingPlan(params) {
	    return Request().post('/app/addPollingPlan', {
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
	},//反馈登记历史详情
	findById(params) {
	    return Request().get('/app/findById/'+params, {
	        
	    });
	},//完成反馈
	completeRectify(params) {
	    return Request().post('/app/completeRectify', {
	        header: {
				contentType: 'application/json',
			},
			data: params
	    });
	},//反馈登记
	recordRectifyAdd(params) {
	    return Request().post('/app/recordRectifyAdd', {
	        header: {
				contentType: 'application/json',
			},
			data: params
	    });
	},
};
