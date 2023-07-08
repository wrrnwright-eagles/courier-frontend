<script setup> 
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import PathServices from "../services/PathServices.js";
import OrderServices from "../services/OrderServices.js";

const route = useRoute();

const orders = ref([]);
const selectedOrder = ref({});
const orderPathSteps = ref([]);

onMounted(async () => {
  await getOrders();
});


async function getOrders() {
  try {
    const response = await OrderServices.getOrders(route.params.id);
    console.log(response.data);
    orders.value = response.data;
  } catch (error) {
    console.log(error);
  }

}

</script>

<template>
    <div class="map-container">
    <div class="map-section">
      <img src="/Map.png" alt="Map" class="map-image">
    </div>
    <div class="text-section">
      <div class="order-selection">
        <v-select label="Order" v-model="selectedOrder" :items="orders" 
          item-title="id" return-value required/>
      </div>
      <div class="text-container">
        <h2>Route Instructions</h2>
        <p>Step by Step Instructions</p>
      </div>
    </div>
  </div>

</template>