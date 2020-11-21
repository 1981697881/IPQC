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
				accept: '*/*'
			},
	    });
	},//获取检查项目
	projectCheckList(params) {
	    return Request().get('/project-check/format', {
			header: {
				accept: '*/*'
			},
			data: params
	    });
	},
};
