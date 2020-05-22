/**
 * 前台系统管理相关
 */
// import User from '@/components/page/home/OnlineUser.vue'

const route = [
    {
        name: 'user',
        path: '/user/OnlineUser',
        component: resolve => require(['@/components/page/home/OnlineUser.vue'], resolve),
        meta: { title: '在线用户' },
    },
     {
        name: 'UserList',
        path: '/user/UserList',
        component: resolve => require(['@/components/page/home/UserList.vue'], resolve),
        meta: { title: '用户列表' },
    },

]

export default route;
