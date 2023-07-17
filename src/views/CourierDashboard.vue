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
  await getPickupCustomers();
  await getDeliveryCustomers();
  await getCouriers();
  await getOrders();
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
    orders.value = response.data.filter(order => order.courierId === courierId);
  } catch (error) {
    console.log(error);
  }
}

</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-card-title class="cool-title">
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
                    <v-btn color="green" :to="`/delivery/${order.id}`">Start</v-btn>
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
  font-size: 2.5rem; 
  background: -webkit-linear-gradient(45deg, #1faf35, #073209);
  text-align: center;
  border-radius: 30px;
}

</style>