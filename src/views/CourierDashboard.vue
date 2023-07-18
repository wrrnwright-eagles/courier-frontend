<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import CourierServices from "../services/CourierServices.js";
import PickupCustomerServices from "../services/PickupCustomerServices.js";
import DeliveryCustomerServices from "../services/DeliveryCustomerServices.js";
import OrderServices from "../services/OrderServices.js"
import ClerkServices from "../services/ClerkServices.js";
import NodeServices from "../services/NodeServices.js";
import EdgeServices from "../services/EdgeServices.js";
import courierImage from '../courier.png';

const snackbar = ref({
  value: false,
  color: '',
  text: ''
});
const couriers = ref([]);
const selectedCourier = ref({
  id: null,
  courierNumber: "",
  name: "",
});
const bonus = ref(0);
const deliveryCustomers = ref([]);
const pickupCustomers = ref([]);
const officeNode = "C3";
const nodes = ref([]);
const edges = ref([]);
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
  getOrders();
  getPickupCustomers();
  getDeliveryCustomers();
  getCouriers();
  setInterval(getOrders, 5000); // polling every 5 seconds
});


function getCustomerName(id, type) {
  const customers = type === 'pickup' ? pickupCustomers.value : deliveryCustomers.value;
  const customer = customers.find(c => c.id === id);
  return customer ? customer.name : '';
}

function getCourierName(id) {
  const courier = couriers.value.find(c => c.id === id);
  return courier ? courier.name : '';
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

async function getCouriers() {
    try {
    const response = await CourierServices.getCouriers();
    couriers.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getOrders() {
  try {
    const response = await OrderServices.getOrders(route.params.id);
    const courierId = window.localStorage.getItem("courierId");
    orders.value = response.data.filter(order => order.courierId == courierId);

    // Calculate bonus
    orders.value.forEach(order => {
      if (order.isDeliveredOnTime) { // assuming we have isDeliveredOnTime field
        bonus.value++;
      }
    });

  } catch (error) {
    console.log(error);
  }
}


</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-card-title style="color: rgb(255, 255, 255); background-color: transparent" class="cool-title">
          Courier Dashboard
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="14">
        <div class="order-container rounded" style="background-color: darkgreen;">
          <h2 style="color: white;">Orders</h2>
          <div class="icon">
          </div>
          <v-row>
            <v-row class="d-flex justify-end">
              <div class="bonus">
  Bonus Tracker: {{ bonus }}
</div>
  </v-row>
  </v-row>
        </div>
        <v-list>
          <div v-for="order in orders" :key="order.id">
            <v-list-item>
              <v-list-item-content>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <h4 class="mb-1">{{ getCustomerName(order.pickupCustomerId, 'pickup') }} &#x2794; {{ getCustomerName(order.deliveryCustomerId, 'delivery') }}</h4>
                    <div class="mb-2">
                      <v-chip small color="green">{{ order.blocks }} Blocks</v-chip>
                      <v-chip small color="blue">{{ getCourierName(order.courierId) }}</v-chip>
                      <v-chip small color="red">Price: ${{ order.price }} </v-chip>
                      <v-chip small color="purple">Estimated Time: {{ order.blocks * 3 }} Minutes </v-chip>
                    </div>
                    <div class="mb-1">{{ order.date }}, {{ order.time }}</div>
                  </div>
                  <div class="actions">
                    <div class="actions">
                      <v-btn color="green" :to="{ name: 'map', params: { orderId: order.id } }">Start</v-btn>
</div>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider> 
          </div>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>


<style scoped>

.order-container {
  padding: 10px;
  border-radius: 30px;
  margin-bottom:10px;
}

.cool-title {
  font-size: 3.0rem; 
  background: -webkit-linear-gradient(45deg, #1faf35, #073209);
  text-align: center;
  font-family: 'Roboto Slab', serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  border-radius: 30px;
  font-weight: bold;
  animation: mymove 5s;
  padding: 25px;
  margin-bottom: 25px;
}
@keyframes mymove {
  50% {letter-spacing: 10px;}
}

.bonus {
  font-size: 1.40rem; 
  text-align: center;
  display: block; 
  padding: 5px;
  color: white;
  margin-right: 35px;
}

</style>