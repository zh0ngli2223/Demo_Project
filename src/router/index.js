import { createRouter, createWebHistory } from 'vue-router'
import { useAllDataStore } from "@/stores";
// import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/IndexView.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('@/views/UserView.vue'),
        },
        {
          path: 'mall',
          name: 'mall',
          component: () => import('@/views/MallView.vue'),
        },
        {
          path: 'page1',
          name: 'page1',
          component: () => import('@/views/Page1.vue'),
        },
        {
          path: 'page2',
          name: 'page2',
          component: () => import('@/views/Page2.vue'),
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    }

  ],
})

const whiteList = ['/login']

//扁平化菜单路径
function getAllowedPaths(menuList) {
  const paths = []
  const flatten = (menus) => {
    menus.forEach(item => {
      if (item.path) {
        paths.push(item.path)
      }
      if (item.children) {
        flatten(item.children)
      }
    })
  }
  flatten(menuList)
  return paths
}

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const store = useAllDataStore()
  if (token) {
    // 已登录
    if (to.path === '/login') {
      next('/home')
    } else {
      // 确保 store 中的菜单已恢复（若未恢复则从 localStorage 读取）
      if (store.state.menuList.length === 0) {
        const storedMenu = localStorage.getItem('menuList')
        if (storedMenu) {
          store.updateMenuList(JSON.parse(storedMenu))
        }
      }

      const allowedPaths = getAllowedPaths(store.state.menuList)
      // 允许访问首页（通常都在菜单中）和允许的路径
      if (to.path === '/' || to.path === '/home' || allowedPaths.includes(to.path)) {
        next()
      } else {
        // 无权限，重定向到首页
        next('/home')
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
