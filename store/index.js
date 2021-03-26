//引入vue和vuex
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({//全局变量定义
    state: {
        forcedLogin: false,//是否需要强制登录
        hasLogin: false,
        username: "",
        password: "",
        userId:'',
        token:'',
        pointId:'',
    },
    mutations: {
        login(state, user) {
            state.username = user.username || '';
            state.password = user.password || '';
            state.hasLogin = true;
            state.userId = user.id || '';
        },
        logout(state) {
           state.username = "";
           state.hasLogin = false;
           state.userId = '';
           state.token = '';
           state.pointId = '';
        },
		setToken(state, user) {
		   state.token = user.token || '';
		},
		delToken(state) {
		   state.token = '';
		}
    }
})
export default store