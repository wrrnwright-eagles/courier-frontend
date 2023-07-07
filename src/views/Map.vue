<script setup> 
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import PathServices from "../services/PathServices.js";
import OrderServices from "../services/OrderServices.js";

onMounted(async () => {
  await getOrders();
});


async function getOrders() {
  try {
    const response = await OrderServices.getOrder(route.params.id);
    console.log(response.data);
    orders.value = response.data[0];
  } catch (error) {
    console.log(error);
  }

}

/* 
function shortestPath(paths, order.pickup.locationNode, order.delivery.locationNode) {
  
}

*/

</script>

<template>
    <div class="map-container">
    <div class="map-section">
      <!-- Map image -->
      <img src="/Map.png" alt="Map" class="map-image">
    </div>
    <div class="text-section">
      <!-- Text container -->
      <div class="text-container">
        <h2>Route Instructions</h2>
        <p>Step by Step Instructions</p>
      </div>
    </div>
  </div>

</template>