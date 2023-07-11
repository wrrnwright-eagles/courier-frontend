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

const route = useRoute();
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
const isAddCourier = ref(false);
const isEditCourier = ref(false);
const deliveryCustomers = ref([]);
const pickupCustomers = ref([]);
const selectedCustomer = ref({});
const isAddCustomer = ref(false);
const isEditCustomer = ref(false);
const confirmDelete = ref(false);
const orders = ref([]);
const selectedOrder = ref({});
const isAddOrder = ref(false);
const isEditOrder = ref(false);

const officeNode = "C3";
const nodes = ref([]);
const edges = ref([]);

const newOrder = ref({
  id: undefined,
  date: undefined,
  time: undefined,
  pickupCustomerId: undefined,
  deliveryCustomerId: undefined,
  courierId: undefined,
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
    orders.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getClerks() {
    try {
    const response = await ClerkServices.getClerks(route.params.id);
    clerks.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getNodes() {
    try {
    const response = await NodeServices.getNodes();
    nodes.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getEdges() {
    try {
    const response = await EdgeServices.getEdges();
    edges.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function addOrder() {
  isAddOrder.value = false;
  delete newOrder.value.id;
  console.log(newOrder.value);
  let pickupLocation = "";
  let deliveryLocation = "";
  for (let i = 0; i < pickupCustomers.value.length; i++) {
    for (let j=0; j < deliveryCustomers.value.length; j++) {
      if(pickupCustomers.value[i].id === newOrder.value.pickupCustomerId) {
        if(deliveryCustomers.value[j].id === newOrder.value.deliveryCustomerId) {
          pickupLocation += pickupCustomers.value[i].locationNode;
          deliveryLocation += deliveryCustomers.value[j].locationNode;
        }
      }
    }
  };


  const nodeTable = [];
  const edgeTable = [];

  for (let i = 0; i < nodes.value.length; i++) {
    const node = nodes.value[i].node;
    nodeTable.push(node);
  }

  for (let i = 0; i < edges.value.length; i++) {
    const fromNode = edges.value[i].fromNode;
    const toNode = edges.value[i].toNode;
    const weight = edges.value[i].weight;
    edgeTable.push({ fromNode, toNode, weight });
  }

  const graph = createGraph(nodeTable, edgeTable);

  //const { distances, previous, path, visitedNodes } = dijkstra(graph, pickupLocation, deliveryLocation);

  const route1 = dijkstra(graph, officeNode, pickupLocation);
  const route2 = dijkstra(graph, pickupLocation, deliveryLocation);
  const route3 = dijkstra(graph, deliveryLocation, officeNode);

  const distances1 = route1.distances;
  const previous1 = route1.previous;
  const path1 = route1.path;
  const visitedNodes1 = route1.visitedNodes;

  const distances2 = route2.distances;
  const previous2 = route2.previous;
  const path2 = route2.path;
  const visitedNodes2 = route2.visitedNodes;

  const distances3 = route3.distances;
  const previous3 = route3.previous;
  const path3 = route3.path;
  const visitedNodes3 = route3.visitedNodes;
  
  const distances = { ...distances1, ...distances2, ...distances3 };
  const previous = { ...previous1, ...previous2, ...previous3 };
  const path = [...path1, ...path2, ...path3];
  const visitedNodes = [...visitedNodes1, ...visitedNodes2, ...visitedNodes3];

  console.log('Combined Results:');
  console.log('Distances:', distances);
  console.log('Previous Nodes:', previous);
  console.log('Shortest Path:', path.join(' -> '));
  console.log('Visited Nodes:', visitedNodes);

  /*
  console.log(distances);
  console.log(previous);
  console.log('Shortest path:', path.join(' -> '));
  console.log('Visited nodes:', visitedNodes);
  */

  newOrder.value.blocks = (visitedNodes.length - 1);
  newOrder.value.price = ((1.5 * (visitedNodes.length - 1)) + 5);

  console.log("blocks = " + newOrder.value.blocks);
  console.log("price = $" + newOrder.value.price);

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
  };
}

function openAddOrder() {
  newOrder.value.date = undefined;
  newOrder.value.time = undefined;
  newOrder.value.pickupCustomerId = undefined;
  newOrder.value.deliveryCustomerId = undefined;
  newOrder.value.courierId = undefined;
  newOrder.value.blocks = undefined;
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

function createGraph(nodeTable, edgeTable) {
  const graph = {};

  // Add nodes to the graph
  for (const node of nodeTable) {
    graph[node] = {};
  }

  // Add edges to the graph with weights
  for (const edge of edgeTable) {
    const { fromNode, toNode, weight } = edge;
    graph[fromNode][toNode] = weight;
  }

  return graph;
}

function dijkstra(graph, startNode, endNode) {
  const distances = {};
  const visited = {};
  const previous = {};
  const queue = [];

  for (const node in graph) {
    distances[node] = Infinity;
  }
  distances[startNode] = 0;

  queue.push(startNode);

  while (queue.length > 0) {
    queue.sort((a,b) => distances[a] - distances[b]);
    const current = queue.shift();
    visited[current] = true;

    if (current === endNode) {
      break;
    }

    for (const neighbor in graph[current]) {
      const distance = graph[current][neighbor];
      const totalDistance = distances[current] + distance;

      if (totalDistance < distances[neighbor]) {
        distances[neighbor] = totalDistance;
        previous[neighbor] = current;

        if (!visited[neighbor]) {
          queue.push(neighbor);
        }
      }
    }
  }

  const path = [];
  let current = endNode;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  const visitedNodes = [];
  for (const node of path) {
    visitedNodes.push({ node, distance: distances[node] });
  }

  return {distances, previous, path, visitedNodes};
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
            </div>
            <div class="mb-1">{{ order.date }}, {{ order.time }}</div>
          </div>
          <div class="actions">
            <v-icon large @click="openEditOrder(order)">
              mdi-pencil
            </v-icon>
            <v-icon large @click="deleteOrder(order.id)">
              mdi-trash-can
            </v-icon>
          </div>
        </div>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider> 
  </div>
</v-list>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn class="mt-3 custom-green-button" large dark @click="openAddOrder">
          <v-icon left>mdi-plus</v-icon>
          Add Order
        </v-btn>
  </v-col>
</v-row>


  <v-dialog v-model="isAddOrder">
      <v-card>
        <v-card-title>Add Order</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addOrder">
            <v-text-field label="Pickup Date" type="date" v-model="newOrder.date" required />
            <v-text-field label="Pickup Time" type="datetime-local" v-model="newOrder.time"
               required />
            <v-select label="Pickup Customer" v-model="newOrder.pickupCustomerId"
              :items="pickupCustomers" item-title="name" item-value="id" return-value required />
            <v-select label="Delivery Customer" v-model="newOrder.deliveryCustomerId" 
              :items="deliveryCustomers" item-title="name" item-value="id" return-value required />
            <v-select label="Courier" v-model="newOrder.courierId" 
              :items="couriers" item-title="name" item-value="id" return-value  required />
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="closeAddOrder">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="addOrder">Add Order</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.value" :color="snackbar.color" :timeout="3000" rounded="pill">
  {{ snackbar.text }}
</v-snackbar>
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

.order-container {
  padding: 10px;
  border-radius: 30px;
  margin-bottom:10px;
}

.custom-green-button {
    background-color: darkgreen !important;
    color: white !important;
    margin-top: 10px; /* Adjust the margin as per your requirement */
    font-size: 22px;
  }
</style>