<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PathServices from "../services/PathServices.js";
import OrderServices from "../services/OrderServices.js";
import NodeServices from "../services/NodeServices.js";
import PickupCustomerServices from "../services/PickupCustomerServices.js";
import DeliveryCustomerServices from "../services/DeliveryCustomerServices.js";
import CourierServices from "../services/CourierServices.js";

const route = useRoute();
const router = useRouter();
const startTime = ref(null);
const endTime = ref(null);
const showAlert = ref(false);
const orderStarted = ref(false);
const selectedOrder = ref({});
const pathSteps = ref([]);
const path = ref([]);
const showStartButton = ref(true);
const nodes = ref([]);
const streetNames = ref([]);
const pickupCustomers = ref([]);
const deliveryCustomers = ref([]);
const couriers = ref([]);
const startOrderSnackbar = ref({ show: false, text: '' }); 
const completeOrderDialog = ref({ show: false, text: '', orderId: null });
const showDeliveryInstructions = ref(false);


onMounted(async () => {
  await getOrder(route.params.orderId);
  await getPaths();
  await getNodes();
  await getPickupCustomers();
  await getDeliveryCustomers();
  await getCouriers();

  matchPathToOrder(selectedOrder.value);
});

async function getOrder(orderId) {
  try {
    const response = await OrderServices.getOrder(orderId);
    selectedOrder.value = response.data;
  } catch (error) {
    console.log(error);
  }
}
function getCustomerName(id, type) {
  const customers = type === 'pickup' ? pickupCustomers.value : deliveryCustomers.value;
  const customer = customers.find(c => c.id === id);
  return customer ? customer.name : '';
}

async function getCouriers() {
    try {
    const response = await CourierServices.getCouriers();
    couriers.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

function startOrderWithAlert() {
  startTime.value = new Date();
  console.log(`Order started at: ${startTime.value}`);
  startOrderSnackbar.value = { show: true, text: 'Order has been started!' };

  setTimeout(() => {
    startOrderSnackbar.value.show = false;
  }, 3000);

  showStartButton.value = false;
  showDeliveryInstructions.value = true; 
}



async function getPaths() {
  try {
    const response = await PathServices.getPaths(route.params.id);
    pathSteps.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getNodes() {
  try {
    const response = await NodeServices.getNodes(route.params.id);
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
  for (let i = 0; i < pathSteps.value.length; i++) {
    if (selectedOrder.pathId === pathSteps.value[i].id) {
      path.value = pathSteps.value[i].path.split(',');
    }
  }

  let pickupOfficeInstructions = "";
  let deliveryOfficeInstructions = "";

  for (let a = 0; a < pickupCustomers.value.length; a++) {
    for (let b = 0; b < deliveryCustomers.value.length; b++) {
      if (pickupCustomers.value[a].id === selectedOrder.pickupCustomerId) {
        if (deliveryCustomers.value[b].id === selectedOrder.deliveryCustomerId) {
          pickupOfficeInstructions += "Arrived at Pickup Destination - " + pickupCustomers.value[a].deliveryInstructions;
          deliveryOfficeInstructions += "Arrived at Delivery Destination - " + deliveryCustomers.value[b].deliveryInstructions;
        }
      }
    }
  }

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

  streetNames.value.unshift(`Start at: ${streetNames.value[0]}`);
  streetNames.value.push(`Arrived back at Office: ${streetNames.value[streetNames.value.length - 1]}`);
}


async function completeOrder() {
  endTime.value = new Date();
  const elapsedTime = (endTime.value - startTime.value) / 60000; 
  console.log(`Order completed at: ${endTime.value}`);
  console.log(`Total time: ${elapsedTime} minutes`);

  if (elapsedTime <= selectedOrder.value.blocks * 3) {
    let bonusCount = localStorage.getItem("bonusCount");
    bonusCount = bonusCount ? Number(bonusCount) : 0;
    localStorage.setItem("bonusCount", bonusCount + 1);
  }

  startTime.value = null;
  endTime.value = null;
  completeOrderDialog.value = {
  show: true,
  text: 'Are you sure you want to complete this order? This can not be undone',
  orderId: route.params.orderId,  
};

}





async function confirmCompleteOrder(orderId) {
  try {
    await OrderServices.completeOrder(orderId); // make an API call to mark the order as complete
  } catch (error) {
    console.error(error);
  }
  router.push({ name: 'courierdashboard' });  // Redirect to CourierDashboard
}



</script>

<template>
  <div class="map-container">
    <div class="order-details-section">
      <div class="order-details">
        <v-btn small color="green">Total Blocks: {{ selectedOrder.blocks }}</v-btn>
        <v-btn small color="red">Price: ${{ selectedOrder.price }}</v-btn>
        <v-btn small color="purple">Estimated Time: {{ selectedOrder.blocks * 3 }} Minutes</v-btn>
        <v-btn small color="blue">Pickup Customer: {{ getCustomerName(selectedOrder.pickupCustomerId, 'pickup') }}</v-btn>
        <v-btn small color="orange">Delivery Customer: {{ getCustomerName(selectedOrder.deliveryCustomerId, 'delivery') }}</v-btn>
      </div>
    </div>
    <div class="content-section">
      <div class="map-section">
        <img src="/Map.png" alt="Map" class="map-image">
      </div>
      

      <v-btn v-if="showStartButton" @click="startOrderWithAlert" color="green" class="start-order-button">Start Order</v-btn>
      <div class="text-section">
        <div class="text-container">
          <v-snackbar
            v-model="startOrderSnackbar.show"
            :timeout="3000"
            color="green"
            top
          >
            {{ startOrderSnackbar.text }}
            <v-btn
              text
              color="white"
              @click="startOrderSnackbar.show = false"
            >
              Close
            </v-btn>
          </v-snackbar>
        </div>

        <div class="delivery-instructions-background">
    <div v-if="showDeliveryInstructions" class="delivery-instructions-container">
      <h2 class="title">Delivery Instructions</h2>
      <v-list-item v-for="(step, index) in streetNames" :key="index" class="path-list">
        {{ step }}
      </v-list-item>
      <div class="button-container">
        <v-btn @click="completeOrder" color="red">Complete Order</v-btn>
      </div>
    </div>
  </div>

    <v-dialog v-model="completeOrderDialog.show" persistent>
      <v-card>
        <v-card-title class="headline">{{ completeOrderDialog.text }}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmCompleteOrder(completeOrderDialog.orderId)">
            Yes
          </v-btn>
          <v-btn color="red darken-1" text @click="completeOrderDialog.show = false">
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</div>
</div>
</template>








<style>
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center; 
  border-radius: 30px;
}
.delivery-instructions-background {
    position: absolute; 
    background-color: #f1f1f3;
    padding: 10px; 
    border-radius: 20px; 
    margin-right: 38px;
  }
  

.content-section {
    display: flex;
    flex-direction: row;
    flex: 1;
    width: 100%;
    justify-content: space-between;
  }

.title {
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.path-list {
  display: flex;
  flex-direction: column;
}

.order-details-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  background-color: transparent;
  z-index: 2;
  width: 100%;
}

.order-details {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f1f1f3;
  border-radius: 5px;
  width: 95%;
}



.map-section {
  flex: 1;
  display: flex;
  margin-top: 11px;
  flex-direction: column;
  position: relative;
  background-color: transparent;
  align-items: flex-start;
  padding-left: 20px;
}

.map-image {
  width: 100%; 
  height: auto;
  object-fit: contain;
  border-radius: 60px;
}

.text-section {
  margin-top: 0px;
  flex: .5;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  padding-left: 10px;
  align-items: flex-start;
  padding-right: 10px;
}

.button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.text-container {
  max-height: 1000px; 
  overflow-y: auto;
  border-radius: 48px;
}

.start-order-button {
    position: absolute; 
    top: 40%; 
    right: 200px;
    font-size: 2em; 
    padding: x; 
    line-height: 1em; 
    transform: translate(0, -50%); 
  }

</style>
