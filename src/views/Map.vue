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
        <h2>Text Container</h2>
        <p>This is the text content you want to display.</p>
      </div>
    </div>
  </div>

</template>

<style scoped>
.container {
  display: flex;
  height: 100vh; /* Set the container to fill the full height of the viewport */
}

.map-section {
  flex: 1; /* Occupy half of the container's width */
  background-color: #f1f1f1; /* Add a background color to the map section */
}

.map-image {
  width: 100%; /* Ensure the map image occupies the entire map section */
  height: 100%; /* Ensure the map image occupies the entire map section */
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