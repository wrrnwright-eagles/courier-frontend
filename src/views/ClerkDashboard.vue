<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import CustomerServices from "../services/CustomerServices.js";
import OrderServices from "../services/OrderServices.js";

const route = useRoute();
const customers = ref([]);
const orders = ref([]);
const isCourier = ref(false);

const newOrder = ref({
  id: undefined,
  date: undefined,
  time: undefined,
  pickup: undefined,
  delivery: undefined,
  courier: undefined,
  blocks: undefined,
  price: undefined,
})

onMounted(async () => {
  await getCustomers();
  await getOrders();
});

async function getCustomers() {
    try {
    const response = await CustomerServices.getCustomer(route.params.id);
    console.log(response.data);
    customers.value = response.data[0];
  } catch (error) {
    console.log(error);
  }
}

async function getOrders() {
    try {
    const response = await OrderServices.getOrder(route.params.id);
    console.log(response.data);
    orders.value = response.data[0];
  } catch (error) {
    console.log(error);
  }

}

</script>

<template>
        <v-container>
        <v-row align="center">
            <v-col cols="10">
                <v-card-title class="pl-0 text-h4 font-weight-bold">
                Clerk Dashboard
                </v-card-title>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
              <div class="order-container">
                <h2>Orders</h2>
                <div class="icon">
                  <v-icon size="x-small" @click="openAddOrder()">
                    mdi-plus
                  </v-icon>
                </div>
                <div class="icon">
                  <v-icon size="x-small" @click="openEditOrder(item)">
                    mdi-pencil
                  </v-icon>
                </div>
                <div class="icon">
                  <v-icon size="x-small" @click="deleteOrder(item)">
                    mdi-trash-can
                  </v-icon>
                </div>
              </div>
                <v-list>
                    <v-list-item v-for="order in orders" :key="order.id">
                        <v-list-item-title>{{ order.date }} {{ order.pickup }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-col>
          </v-row>
    </v-container>
</template>