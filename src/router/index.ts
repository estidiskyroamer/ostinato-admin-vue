import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import LoginView from '@/views/login/LoginView.vue'
import { useAuth } from '@/composables/useAuth'
import UserView from '@/views/users/UserView.vue'
import ScheduleView from '@/views/schedule/ScheduleView.vue'

const { isAuthenticated } = useAuth();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        return isAuthenticated() ? '/dashboard' : '/login'
      },
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
      path: '/users',
      name: 'users',
      component: UserView,
      meta: { requiresAuth: true, title: 'Ostinato | Users' },
    },
    {
      path: '/schedules',
      name: 'schedules',
      component: ScheduleView,
      meta: { requiresAuth: true, title: 'Ostinato | Schedules' },
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
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/login"); // Redirect to login if not authenticated
  } else {
    next();
  }

  //Page title guard
  document.title = String(to.meta.title || 'Ostinato')
});


export default router
