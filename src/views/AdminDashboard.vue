<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import CourierServices from "../services/CourierServices.js";
import CustomerServices from "../services/CustomerServices.js";
import OrderServices from "../services/OrderServices.js"
import ClerkServices from "../services/ClerkServices.js";

const route = useRoute();
const couriers = ref([]);
const customers = ref([]);
const orders = ref([]);
const clerks = ref([]);
const isAdmin = ref(false);

onMounted(async () => {
  await getCustomers();
  await getCouriers();
  await getOrders();
  await getClerks();
});

async function getCustomers() {
    try {
    const response = await CustomerServices.getCustomer(route.params.id);
    customers.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getCouriers() {
    try {
    const response = await CourierServices.getCourier(route.params.id);
    couriers.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getOrders() {
    try {
    const response = await OrderServices.getOrder(route.params.id);
    orders.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getClerks() {
    try {
    const response = await ClerkServices.getClerk(route.params.id);
    clerks.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

// CRUD for Couriers
async function createCourier(courier) {
  try {
    const response = await CourierServices.createCourier(courier);
    couriers.value.push(response.data);
  } catch (error) {
    console.log(error);
  }
}

async function updateCourier(courier) {
  try {
    const response = await CourierServices.updateCourier(courier.id, courier);
    const index = couriers.value.findIndex(c => c.id === courier.id);
    if (index !== -1) {
      couriers.value[index] = courier;
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteCourier(id) {
  try {
    await CourierServices.deleteCourier(id);
    couriers.value = couriers.value.filter(c => c.id !== id);
  } catch (error) {
    console.log(error);
  }
}

// CRUD for Clerks
async function createClerk(clerk) {
  try {
    const response = await ClerkServices.createClerk(clerk);
    clerks.value.push(response.data);
  } catch (error) {
    console.log(error);
  }
}

async function updateClerk(clerk) {
  try {
    const response = await ClerkServices.updateClerk(clerk.id, clerk);
    const index = clerks.value.findIndex(c => c.id === clerk.id);
    if (index !== -1) {
      clerks.value[index] = clerk;
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteClerk(id) {
  try {
    await ClerkServices.deleteClerk(id);
    clerks.value = clerks.value.filter(c => c.id !== id);
  } catch (error) {
    console.log(error);
  }
}

// CRUD for Customers
async function createCustomer(customer) {
  try {
    const response = await CustomerServices.createCustomer(customer);
    customers.value.push(response.data);
  } catch (error) {
    console.log(error);
  }
}

async function updateCustomer(customer) {
  try {
    const response = await CustomerServices.updateCustomer(customer.id, customer);
    const index = customers.value.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      customers.value[index] = customer;
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteCustomer(id) {
  try {
    await CustomerServices.deleteCustomer(id);
    customers.value = customers.value.filter(c => c.id !== id);
  } catch (error) {
    console.log(error);
  }
}

// CRUD for Orders
async function createOrder(order) {
  try {
    const response = await OrderServices.createOrder(order);
    orders.value.push(response.data);
  } catch (error) {
    console.log(error);
  }
}

async function updateOrder(order) {
  try {
    const response = await OrderServices.updateOrder(order.id, order);
    const index = orders.value.findIndex(o => o.id === order.id);
    if (index !== -1) {
      orders.value[index] = order;
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteOrder(id) {
  try {
    await OrderServices.deleteOrder(id);
    orders.value = orders.value.filter(o => o.id !== id);
  } catch (error) {
    console.log(error);
  }
}

</script>


<template>
    <v-container>
        <v-row align="center">
            <v-col cols="12">
                <v-card-title class="pl-0 text-h4 font-weight-bold">
                Dashboard
                </v-card-title>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <h2>Orders</h2>
                <v-list>
                    <v-list-item v-for="order in orders" :key="order.id">
                        <v-list-item-title>{{ order.date }} {{ order.pickup }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6">
                <h2>Couriers</h2>
                <v-list>
                    <v-list-item v-for="courier in couriers" :key="courier.id">
                        <v-list-item-title>{{ courier.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6">
                <h2>Customers</h2>
                <v-list>
                    <v-list-item v-for="customer in customers" :key="customer.id">
                        <v-list-item-title>{{ customer.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6">
                <h2>Clerks</h2>
                <v-list>
                    <v-list-item v-for="clerk in clerks" :key="clerk.id">
                        <v-list-item-title>{{ clerk.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </v-container>
</template>
