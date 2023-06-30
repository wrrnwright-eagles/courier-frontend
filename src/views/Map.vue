<script setup> 
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";



</script>

<template>
    <div class="container">
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

<style scoped>
.container {
  display: flex;
  height: 100%; /* Set the container to fill the full height of the viewport */
}

.map-section {
  flex: 2; /* Occupy half of the container's width */
  background-color: #f1f1f1; /* Add a background color to the map section */
}

.map-image {
  padding: 10px;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Maintain aspect ratio and cover the entire map section */
}

.text-section {
  flex: 1; /* Occupy half of the container's width */
  padding: 20px; /* Add some padding to the text section */
}

.text-container {
  background-color: #fff; /* Add a background color to the text container */
  height: 100%; /* Ensure the text container occupies the entire text section */
  
}
</style>