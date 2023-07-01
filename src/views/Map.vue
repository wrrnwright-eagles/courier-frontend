<script setup> 
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";



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