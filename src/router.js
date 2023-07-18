import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("./views/AdminDashboard.vue"),
    },
    {
      path: "/courierdashboard", 
      name: "courierdashboard",
      component: () => import("./views/CourierDashboard.vue"),
    },
    {
      path: "/clerkdashboard", 
      name: "clerkdashboard",
      component: () => import("./views/ClerkDashboard.vue"),
    },
    {
      path: '/map/:orderId',
      name: 'map',
      component: () => import('./views/map.vue'),
    },
    {
      path: '/delivery/:orderId',
      name: 'Delivery',
      component: () => import('./views/Delivery.vue')
    }
  ],
});

export default router;
