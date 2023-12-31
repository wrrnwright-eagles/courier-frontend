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
import UserServices from "../services/UserServices.js";
import PathServices from "../services/PathServices.js";

const completedOrders = ref([]);
const route = useRoute();
const snackbar = ref({
  value: false,
  color: '',
  text: ''
});
const couriers = ref([]);
const deliveryCustomers = ref([]);
const pickupCustomers = ref([]);
const selectedCustomer = ref({});
const confirmDelete = ref(false);
const orders = ref([]);
const selectedOrder = ref({});
const isAddOrder = ref(false);
const isEditOrder = ref(false);
const addOrderData = ref({
  date: undefined,
  time: undefined,
  pickupCustomerId: undefined,
  deliveryCustomerId: undefined,
  courierId: undefined,
  blocks: undefined,
  price: undefined,
});
const officeNode = "C3";
const nodes = ref([]);
const edges = ref([]);
const courierUsers = ref([]);
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
const newPath = ref({
  id: undefined,
  path: undefined,
})
const paths = ref([]);
const pendingOrders = ref([]);


onMounted(async () => {
  await getPickupCustomers();
  await getDeliveryCustomers();
  await getOrders();
  await getNodes();
  await getEdges();
  await getPaths();
  couriers.value = await getCouriers();  
  courierUsers.value = await UserServices.getCourierUsers();  
  completedOrders.value = orders.value.filter(order => order.status === 'completed');
    pendingOrders.value = orders.value.filter(order => order.status === null);
});

function getCustomerName(id, type) {
  const customers = type === 'pickup' ? pickupCustomers.value : deliveryCustomers.value;
  const customer = customers.find(c => c.id === id);
  return customer ? customer.name : '';
}

async function getPaths() {
    try {
    const response = await PathServices.getPaths();
    paths.value = response.data;
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

async function getCouriers() {
  try {
    const couriersResponse = await CourierServices.getCouriers();
    const courierUsersResponse = await UserServices.getCourierUsers(); 

    const couriers = couriersResponse.data.map((courier) => ({
      id: courier.id,
      name: courier.name,
      courierNumber: courier.courierNumber,
    }));

    const courierUsers = courierUsersResponse.data 
      .filter((user) => user.isCourier)
      .map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        courierNumber: user.id.toString(),
      }));

    return [...couriers, ...courierUsers];
  } catch (error) {
    console.log(error);
    return [];
  }
}

function getCourierName(id) {
  if (couriers.value && couriers.value.length > 0) {
    const courier = couriers.value.find(c => c.id === id);
    if (courier) {
      return courier.name;
    }
  }

  if (courierUsers.value && courierUsers.value.length > 0) {
    const courierUser = courierUsers.value.find(u => u.id === id);
    if (courierUser && courierUser.isCourier) {
      return courierUser.name;
    }
  }
  return '';
}

async function getOrders() {
    try {
        const response = await OrderServices.getOrders(route.params.id);
        orders.value = response.data;
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
// if the courierId is an object, extract the id from it
if (newOrder.value.courierId && typeof newOrder.value.courierId === 'object' && newOrder.value.courierId.id) {
  newOrder.value.courierId = newOrder.value.courierId.id;
}
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

  var lastPath = undefined;
  try {
    newPath.value.path = path.join(',');
    //console.log(newPath.value);
    await PathServices.addPath(newPath.value);
    await getPaths();
    lastPath = paths.value.length - 1;
  } catch (error) {
    console.log(error);
  }
  newOrder.value.pathId = paths.value[lastPath].id;
  newOrder.value.blocks = (visitedNodes.length - 1);
  newOrder.value.price = ((1.5 * (visitedNodes.length - 1)) + 5);
  try {
    console.log('Order to be sent: ', newOrder.value);
await OrderServices.addOrder(newOrder.value);
    snackbar.value = {
      value: true,
      color: 'green',
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
  addOrderData.value.date = undefined;
  addOrderData.value.time = undefined;
  addOrderData.value.pickupCustomerId = undefined;
  addOrderData.value.deliveryCustomerId = undefined;
  addOrderData.value.courierId = undefined;
  addOrderData.value.blocks = undefined;
  addOrderData.value.price = undefined;
  isAddOrder.value = true;
}

function closeAddOrder() {
  isAddOrder.value = false;
}

function openEditOrder(item) {
  selectedOrder.value.id = item.id;
  selectedOrder.value.date = item.date;
  selectedOrder.value.time = item.time;
  selectedOrder.value.pickupCustomerId = item.pickupCustomerId;
  selectedOrder.value.deliveryCustomerId = item.deliveryCustomerId;
  selectedOrder.value.courierId = item.courierId;
  selectedOrder.value.price = item.price;
  isEditOrder.value = true;
}

function closeEditOrder() {
  isEditOrder.value = false;
}

async function updateOrder(order) {
  if (order.courierId && typeof order.courierId === 'object') {
    order.courierId = order.courierId.id;
  }
  try {
    console.log(order);
    const response = await OrderServices.updateOrder(order);
    console.log(response);

    if (response.status === 200) {
  snackbar.value = {
    value: true,
    color: "green",
    text: "Order updated successfully!"
  };
  isEditOrder.value = false; 
} else {
  throw new Error(response.data.message || "Unexpected response format");
}

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
  const confirmDialog = confirm("Are you sure you want to Delete this order?");
  if (confirmDialog) {
    try {
      await OrderServices.deleteOrder(id);
      orders.value = orders.value.filter(o => o.id !== id);
      snackbar.value = {
        value: true,
        color: 'green',
        text: 'Order Deleted successfully!'
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
  for (const node of nodeTable) {
    graph[node] = {};
  }
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
        <v-card-title class="pl-0 text-h4 font-weight-bold cool-title">
          Clerk Dashboard
        </v-card-title>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="14">
        <div class="order-container" style="background-color: darkgreen;">
          <h2 style="color: white;">Orders</h2>
          <div class="icon">
          </div>
        </div>
        <v-list>
          <div v-for="order in pendingOrders" :key="order.id">
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
        <v-text-field label="Pickup Time" type="datetime-local" v-model="newOrder.time" required />
        <v-select label="Pickup Customer" v-model="newOrder.pickupCustomerId"
          :items="pickupCustomers" item-title="name" item-value="id" return-value required />
        <v-select label="Delivery Customer" v-model="newOrder.deliveryCustomerId"
          :items="deliveryCustomers" item-title="name" item-value="id" return-value required />
        <v-select label="Courier" v-model="newOrder.courierId"
          :items="couriers" item-title="name" item-value="id" return-object required />
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeAddOrder">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="addOrder">Add Order</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</v-dialog>

<div class="order-container" style="background-color: darkgreen;">
  <h2 style="color: white;">Completed Orders</h2>
  <div class="icon">
  </div>
</div>
<v-list>
  <div v-for="order in completedOrders" :key="order.id">
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
        </div>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider> 
  </div>
</v-list>
<v-dialog v-model="isEditOrder">
  <v-card>
    <v-card-title>Edit Order</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="updateOrder(selectedOrder)">
        <v-text-field label="Pickup Date" type="date" v-model="selectedOrder.date" required />
        <v-text-field label="Pickup Time" type="datetime-local" v-model="selectedOrder.time" required />
        <v-select label="Pickup" v-model="selectedOrder.pickupCustomerId"
          :items="pickupCustomers" item-title="name" item-value="id" return-value required />
        <v-select label="Delivery" v-model="selectedOrder.deliveryCustomerId"
          :items="deliveryCustomers" item-title="name" item-value="id" return-value required />
        <v-select label="Courier" v-model="selectedOrder.courierId"
          :items="couriers" item-title="name" item-value="id" return-object required />
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeEditOrder">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="updateOrder(selectedOrder)">Save</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</v-dialog>
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
  animation: fade 10s;
  margin-top: 24px;
}

.custom-green-button {
    background-color: darkgreen !important;
    color: white !important;
    margin-top: 10px; 
    font-size: 22px;
  }

  @keyframes fade {

  50%  {opacity: 1;}
}

.cool-title {
  font-size: 2.5rem; 
  color: rgb(255, 255, 255);
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

</style>