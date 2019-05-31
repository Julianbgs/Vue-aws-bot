import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import UserManagement from './views/UserManagement.vue'
import Credentials from './views/Credentials.vue'
import TaskManagment from './views/TaskManagment.vue'
import login from './views/Login.vue'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/users',
            name: 'user-management',
            component: UserManagement,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/credentials',
            name: 'credentials',
            component: Credentials,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/tasks',
            name: 'task-management',
            component: TaskManagment,
            meta: {
                requiresAuth: true
            }
        }
    ]
});

export default router;

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!localStorage.getItem('jwt')) {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            });
        } else {
            next();
        }
    } else {
        next();
    }
});
