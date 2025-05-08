import { createRouter, createWebHashHistory } from 'vue-router'
import Landing from '../views/Landing.vue'

const routes = [
  { path: '/', name: 'landing', component: Landing },
  {
    path: '/project/:id', 
    name: 'project', 
    component: () => import('../views/ToDoProject.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) { return { top: 0 } }
})

export default router