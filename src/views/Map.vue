<script setup> 
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import PathServices from "../services/PathServices.js";
import OrderServices from "../services/OrderServices.js";
import NodeServices from "../services/NodeServices.js";
import PickupCustomerServices from "../services/PickupCustomerServices.js";
import DeliveryCustomerServices from "../services/DeliveryCustomerServices.js";

const route = useRoute();

const myOrders = ref([]); // new ref for my orders
const allOrders = ref([]); // new ref for all orders
const selectedOrder = ref({});
const pathSteps = ref([]);
const path = ref([]);
const nodes = ref([]);
const streetNames = ref([]);
const pickupCustomers = ref([]);
const deliveryCustomers = ref([]);

onMounted(async () => {
  await getOrders();
  await getPaths();
  await getNodes();
  await getPickupCustomers();
  await getDeliveryCustomers();
});


async function getOrders() {
  try {
    const response = await OrderServices.getOrders(route.params.id);
    const courierId = window.localStorage.getItem("courierId");
    myOrders.value = response.data.filter(order => order.courierId == courierId);
    allOrders.value = response.data.filter(order => order.courierId == null || order.courierId != courierId);


    myOrders.value.forEach(order => {
      if (order.isDeliveredOnTime) { 
        bonus.value++;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function getPaths() {
  try {
    const response = await PathServices.getPaths(route.params.id);
    //console.log(response.data);
    pathSteps.value = response.data;
  } catch (error) {
    console.log(error);
  }

}
async function getNodes() {
  try {
    const response = await NodeServices.getNodes(route.params.id);
    //console.log(response.data);
    nodes.value = response.data;
  } catch (error) {
    console.log(error);
  }

}

async function getDeliveryCustomers() {
    try {
    const response = await DeliveryCustomerServices.getDeliveryCustomers();
    deliveryCustomers.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getPickupCustomers() {
    try {
    const response = await PickupCustomerServices.getPickupCustomers();
    pickupCustomers.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

function matchPathToOrder(selectedOrder) {

  //console.log(selectedOrder.id);
  //console.log(path.length);
    for (let i = 0; i < pathSteps.value.length; i++) {
      if (selectedOrder.pathId === pathSteps.value[i].id) {
        //console.log(pathSteps.value[i].path);
        //console.log(pathSteps.value[i].path.split(','));
        path.value = pathSteps.value[i].path.split(',');
        //console.log(path);
      }
    }

    let pickupOfficeInstructions = "";
    let deliveryOfficeInstructions = "";


    for (let a = 0; a < pickupCustomers.value.length; a++) {
      for (let b = 0; b < deliveryCustomers.value.length; b++) {
        if (pickupCustomers.value[a].id === selectedOrder.pickupCustomerId) {
          if (deliveryCustomers.value[b].id === selectedOrder.deliveryCustomerId) {
            console.log(pickupCustomers.value[a].deliveryInstructions);
            console.log(deliveryCustomers.value[b].deliveryInstructions);
            pickupOfficeInstructions += "Arrived at Destination - " + pickupCustomers.value[a].deliveryInstructions;
            deliveryOfficeInstructions += "Arrived at Destination - " + deliveryCustomers.value[b].deliveryInstructions;
          }
        }
      }
    }

    console.log(pickupOfficeInstructions);
    console.log(deliveryOfficeInstructions);

    let setDropLocation = false;

    for (let x = 0; x < path.value.length; x++) {
      for (let y = 0; y < nodes.value.length; y++) {
        if (path.value[x] === nodes.value[y].node) {
          streetNames.value[x] = nodes.value[y].streetName;
        }
        if ((streetNames.value[x] === streetNames.value[x-1]) && (setDropLocation)) {
          streetNames.value[x] = pickupOfficeInstructions;
          setDropLocation = false;
        }
        if (streetNames.value[x] === streetNames.value[x-1]) {
          streetNames.value[x] = deliveryOfficeInstructions;
          setDropLocation = true;
        }
      }
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
        <v-select label="Order" v-model="selectedOrder" :items="myOrders" 
          item-title="id" return-object required/>
      </div>
      <div>
        <v-btn @click="matchPathToOrder(selectedOrder)">Get Path</v-btn>
      </div>
      <div class="text-container">
        <h2>Route Instructions</h2>
        <div>
          <p>Start</p>
          <v-list-item v-for="(step, index) in streetNames" :key="index" class="path-list">
            {{ step }}
          </v-list-item>
          <p>End</p>
        </div>
      </div>
    </div>
  </div>

</template>

<style>
.path-list {
  display: flex;
  flex-direction: column;
}
</style>