<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import CustomerServices from "../services/CustomerServices.js";
import OrderServices from "../services/OrderServices.js";
import courierImage from '../courier.png';
import CourierServices from "../services/CourierServices.js";

const route = useRoute();
const customers = ref([]);
const couriers = ref([]);
const orders = ref([]);
const isCourier = ref(false);
const selectedOrder = ref({});
const isAddOrder = ref(false);
const isEditOrder = ref(false);
const newOrder = ref({
  id: undefined,
  date: undefined,
  time: undefined,
  pickup: {},
  delivery: {},
  courier: {},
  blocks: undefined,
  price: undefined,
})
const snackbar = ref({
  value: false,
  color: '',
  text: ''
});

onMounted(async () => {
  await getCustomers();
  await getCouriers();
  await getOrders();
});

async function getCustomers() {
    try {
    const response = await CustomerServices.getCustomers();
    customers.value = response.data;
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
    const response = await OrderServices.getOrder(route.params.id);
    console.log(response.data);
    orders.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function addOrder() {
  isAddOrder.value = false;
  delete newOrder.value.id;
  try {
    await OrderServices.addOrder(newOrder.value);
    snackbar.value = {
      value: true,
      color: 'black',
      text: 'Added Successfully!'
    };
    getOrders();
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: 'red',
      text: error.response.data.message
    };
  }
}

function openAddOrder() {
  console.log("Opening Add Order");
  newOrder.value.date = undefined;
  newOrder.value.time = undefined;
  newOrder.value.pickup = {};
  newOrder.value.delivery = {};
  newOrder.value.courier = {};
  newOrder.value.price = undefined;
  isAddOrder.value = true;
}

function closeAddOrder() {
  isAddOrder.value = false;
}

function openEditOrder(item) {
  newOrder.value.id = item.id;
  newOrder.value.date = item.date;
  newOrder.value.time = item.time;
  newOrder.value.pickup = item.pickup;
  newOrder.value.delivery = item.delivery;
  newOrder.value.courier = item.courier;
  newOrder.value.price = item.price;
  isEditOrder.value = true;
}

function closeEditOrder() {
  isEditOrder.value = false;
}

async function updateOrder(order) {
  try {
    const response = await OrderServices.updateOrder(order);
    const index = response.data.findIndex((o) => o.id === order.id);
    if (index !== -1) {
      response.data[index] = order;
    }
    snackbar.value = {
      value: true,
      color: "success",
      text: "Order updated successfully!"
    };
    getOrders(); 
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: "error",
      text: "Failed to update order!"
    };
  }
}
async function deleteOrder(id) {
  const confirmDialog = confirm("Are you sure you want to delete this order?");
  if (confirmDialog) {
    try {
      await OrderServices.deleteOrder(id);
      orders.value = orders.value.filter(o => o.id !== id);
      snackbar.value = {
        value: true,
        color: 'green',
        text: 'Order deleted successfully!'
      };
    } catch (error) {
      console.log(error);
      snackbar.value = {
        value: true,
        color: 'error',
        text: 'Failed to delete order!'
      };
    }
  }
}

</script>

<template>
  <v-container>
    <v-row align="center">
      <div class="shadow-container">
      <div class="image-container">
        <img :src="courierImage" alt="courier image">
      </div>
    </div>
      <v-col cols="12">
        <v-card-title class="pl-0 text-h4 font-weight-bold">
          Clerk Dashboard
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="14">
        <div class="order-container rounded" style="background-color: darkgreen;">
          <h2 style="color: white;">Orders</h2>
          <div class="icon">
            <v-icon size="x-small" @click="openAddOrder()">
              mdi-plus
            </v-icon>
          </div>
        </div>

        <v-dialog v-model="isAddOrder">
  <v-card>
    <v-card-title>Add Order</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="addOrder">
        <v-text-field label="Date" type="date" v-model="newOrder.date" required />
        <v-text-field label="Time" type="time" v-model="newOrder.time" required />
        <v-select label="Pickup Customer" v-model="newOrder.pickup.id"
  :items="customers" item-text="name" return-object required />

<v-select label="Delivery Customer" v-model="newOrder.delivery.id" 
  :items="customers" item-text="name" return-object required />

<v-select label="Courier" v-model="newOrder.courier.id" 
  :items="couriers" item-text="name" return-object required />
>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeAddOrder">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="addOrder">Add Order</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</v-dialog>

        <v-list>
  <v-list-item v-for="order in orders" :key="order.id">
    <v-list-item-title>{{ order.date }} {{ order.pickup.name }}</v-list-item-title>
    <v-list-item-action>
      <v-icon size="x-small" @click="openEditOrder(order)">
        mdi-pencil
      </v-icon>
      <v-icon size="x-small" @click="deleteOrder(order.id)">
       mdi-trash-can
      </v-icon>
    </v-list-item-action>
  </v-list-item>
</v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.shadow-container {
  display: flex;
  justify-content: center;
  margin: 20px auto; 
  margin-bottom: 20px; 
  box-shadow: 23px 30px 30px rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  overflow: hidden;
}

.image-container {
  border-radius: 50%;
  overflow: hidden;
}

.image-container img {
  width: 500px; 
  height: 350px; 
  object-fit: cover;
  border-radius: 50%;
  overflow: hidden;
}
</style>