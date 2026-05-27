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
      },
      {
        path: 'tool-management/dashboard',
        name: 'Dashboard',
        component: () => import('pages/tool-management/DashboardPage.vue'),
        meta: {
          title: 'Operations Dashboard',
          breadcrumb: [
            { label: 'Tool Management', icon: 'handyman' },
            { label: 'Operations Dashboard' }
          ]
        }
      },
      {
        path: 'tool-management/current-status',
        name: 'CurrentStatus',
        component: () => import('pages/tool-management/CurrentStatusPage.vue'),
        meta: {
          title: 'Current Status',
          breadcrumb: [
            { label: 'Tool Management', icon: 'handyman' },
            { label: 'Current Status' }
          ]
        }
      },
      {
        path: 'tool-management/scrap-history',
        name: 'ScrapHistory',
        component: () => import('pages/tool-management/ScrapHistoryPage.vue'),
        meta: {
          title: 'Scrap History',
          breadcrumb: [
            { label: 'Tool Management', icon: 'handyman' },
            { label: 'Scrap History' }
          ]
        }
      },
      {
        path: 'tool-management/maintenance',
        name: 'MaintenanceControl',
        component: () => import('pages/tool-management/MaintenanceControlPage.vue'),
        meta: {
          title: 'Maintenance Control',
          breadcrumb: [
            { label: 'Tool Management', icon: 'handyman' },
            { label: 'Maintenance Control' }
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
