import { getRoleMenusTree } from '@/api/modules/system'
import { API_CODE, STORAGE } from '@/components/common/global'


export default {
    state: {
        //左侧菜单
        leftMenus: [
        ]
    },
    mutations: {
        // 设置左侧的菜单
        setLeftMenus(state, payload = []){
            state.leftMenus = payload
        }
    },
    actions: {
        setLeftMenus({commit, state}, payload = {}) {
            var isToken = localStorage.getItem(STORAGE.API_TOKEN);
            if(!isToken)
            {
                return ;
            }
            getRoleMenusTree(payload).then(res => {
                if(res.code == 0){
                    let lists = res.data.lists;
                    commit('setLeftMenus', lists)
                }
            })
        }
    }
}
