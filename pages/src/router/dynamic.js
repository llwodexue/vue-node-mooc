/**
 * component 需要为字符串 'layout'
 * 而不是 component: () => import('@/layout')
 */

export const dynamicRoutes = [
  {
    path: '/book',
    component: 'layout',
    redirect: '/book/create',
    name: 'book',
    meta: { title: '图书管理', icon: 'dict' },
    children: [
      {
        path: '/book/create',
        component: 'book/create',
        name: 'bookCreate',
        meta: { title: '上传图书', icon: 'edit' }
      },
      {
        path: '/book/edit/:fileName',
        component: 'book/edit/index',
        name: 'bookEdit',
        hidden: true,
        meta: {
          title: '编辑图书',
          icon: 'edit',
          activeMenu: '/book/list'
        }
      },
      {
        path: '/book/list',
        component: 'book/list/index',
        name: 'bookList',
        meta: { title: '图书列表', icon: 'list' }
      }
    ]
  }
]

export const userRoutes = [
  {
    path: '/book',
    component: 'layout',
    redirect: '/book/create',
    name: 'book',
    meta: { title: '图书管理', icon: 'documentation' },
    children: [
      {
        path: '/book/list',
        component: 'book/list/index',
        name: 'bookList',
        meta: { title: '图书列表', icon: 'list' }
      }
    ]
  }
]
