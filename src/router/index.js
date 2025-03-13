// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";
import DashBoard from "../views/DashBoard.vue";
import User from "../views/user/index.vue";
import Recipes from "../views/recipes/index.vue";
import Detail from "../views/recipes/detail.vue";
import Cuisines from '../views/cuisines/index.vue';
import { getToken } from "../utils/auth"; // 访问缓存的用户名

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashBoard,
    meta: { requiresAuth: true },
    children: [
      {
        path: "recipes",
        name: "Recipes",
        component: Recipes,
        meta: { requiresAuth: true },
      },
      {
        path: "cuisines",
        name: "Cuisines",
        component: Cuisines,
        meta: { requiresAuth: true },
      },
      
      {
        path: "user",
        name: "User",
        component: User,
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: "/detail",
    name: "Detail",
    component: Detail,
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!getToken(); // 根据缓存判断是否登录

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login"); // 未登录重定向到登录页
  } else {
    next(); // 允许访问
  }
});

export default router;
