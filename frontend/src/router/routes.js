const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/administration/master-registration'
      },
      {
        path: 'administration/master-registration',
        name: 'MasterRegistration',
        component: () => import('pages/master-registration/MasterRegistrationPage.vue'),
        meta: {
          title: 'Master Registration',
          breadcrumb: [
            { label: 'Administration', icon: 'settings' },
            { label: 'Master Registration' }
          ]
        }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
