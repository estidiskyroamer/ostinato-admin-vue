import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import LoginView from '@/views/login/LoginView.vue'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, title: 'Ostinato | Dashboard' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Ostinato | Login' },
    }
  ],
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  //Authentication guard
  const { isAuthenticated } = useAuth();
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/login"); // Redirect to login if not authenticated
  } else {
    next();
  }

  //Page title guard
  document.title = String(to.meta.title || 'Ostinato')
});


export default router
