<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import CourierServices from "../services/CourierServices.js";
import CustomerServices from "../services/CustomerServices.js";
import OrderServices from "../services/OrderServices.js"

const couriers = ref([]);
const customers = ref([]);
const isAdmin = ref(false);
onMounted(async () => {
  await getCustomers();
  await getCouriers();
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
// Add, Update and Remove Customers
async function getCouriers() {
    try {
    const response = await CourierServices.getCourier(route.params.id);
    console.log(response.data);
    couriers.value = response.data[0];
  } catch (error) {
    console.log(error);
  }
}
// Add, Update and Remove Couriers

const orders = ref([]);

</script>

<template>
    <v-container>
        <v-row align="center">
            <v-col cols="10">
                <v-card-title class="pl-0 text-h4 font-weight-bold">
                Dashboard
                </v-card-title>
            </v-col>
        </v-row>
    </v-container>
</template>