const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/organizator',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Organizator.vue') }],
  },
  {
    path: '/izvodac',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Izvodac.vue') }],
  },
  {
    path: '/nastupi',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/DogadanjaPage.vue') }],
  },
  {
    path: '/onama',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AboutUsPage.vue') }],
  },
  {
    path: '/nastupiNovo',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/DogadanjaNovoPage.vue') }],
  },
]

export default routes
