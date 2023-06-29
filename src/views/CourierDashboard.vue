<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import CustomerServices from "../services/CustomerServices.js";
import OrderServices from "../services/OrderServices.js";

const route = useRoute();
const customers = ref([]);
const orders = ref([]);

onMounted(async () => {
  await getCustomers();
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
                Courier Dashboard
                </v-card-title>
            </v-col>
        </v-row>
    </v-container>
</template>