import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: resolve => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: resolve => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: resolve => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: resolve => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: resolve => require(['@/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]
