import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Cards from '../views/CardView.vue'
import Quiz from '../views/Quiz.vue'
import LeaderBoard from '../views/LeaderBoard.vue'
import LoginView from '../views/LoginView.vue'
import ChartView from '../views/ChartView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/cards',
    name: 'Cards',
    component: Cards  
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: Quiz
  },
  {
    path: '/deck-leaders',
    name: 'DeckLeader',
    component: LeaderBoard
  },
  {
    path:'/login',
    name: 'Login',
    component: LoginView
  },
  {
    path:'/chart',
    name: 'Chart',
    component: ChartView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
