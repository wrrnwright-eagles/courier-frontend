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
import PathServices from "../services/PathServices.js";
import courierImage from '../courier.png';
import { jsPDF } from "jspdf";
import UserServices from "../services/UserServices.js";

const courierUsers = ref([]);
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
const dialog = ref(false);
const selectedMonth = ref(null);
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
const paths = ref([]);
const clerks = ref([]);
const isAddClerk = ref(false);
const isEditClerk = ref(false);
const selectedClerk = ref({
  id: null,
  clerkNumber: "",
  name: "",
});
const addOrderData = ref({
  date: undefined,
  time: undefined,
  pickupCustomerId: undefined,
  deliveryCustomerId: undefined,
  courierId: undefined,
  blocks: undefined,
  price: undefined,
});
const newCourier = ref({
  id: undefined,
  courierNumber: undefined,
  name: undefined,
});

const newCustomer = ref({
  id: undefined,
  customerNumber: undefined,
  name: undefined,
  locationDescription: undefined,
  locationNode: undefined, 
  deliveryInstructions: undefined,
});

const newClerk = ref({
  id: undefined,
  clerkNumber: undefined,
  name: undefined,
});

const newOrder = ref({
  id: undefined,
  date: undefined,
  time: undefined,
  pickupCustomerId: undefined,
  deliveryCustomerId: undefined,
  courierId: undefined,
  pathId: undefined,
  blocks: undefined,
  price: undefined,
})

const newPath = ref({
  id: undefined,
  path: undefined,
})

onMounted(async () => {
  await getDeliveryCustomers();
  await getPickupCustomers();
  couriers.value = await getCouriers();  
  await getOrders();
  await getClerks();
  await getNodes();
  await getEdges();
  await getPaths();
  courierUsers.value = await UserServices.getCourierUsers();  
});

function getCustomerName(id, type) {
  const customers = type === 'pickup' ? pickupCustomers.value : deliveryCustomers.value;
  const customer = customers.find(c => c.id === id);
  return customer ? customer.name : '';
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

async function getPaths() {
    try {
    const response = await PathServices.getPaths();
    paths.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function fetchInvoicesForSelectedMonth() {
  dialog.value = false; // close dialog

  try {
    const response = await OrderServices.getOrders();
    const orders = response.data;

    // Get the selected month
    const now = new Date();
    const selectedMonthNumber = now.getMonth() - selectedMonth.value;
    const selectedYear = selectedMonthNumber < 0 ? now.getFullYear() - 1 : now.getFullYear();

    // Filter orders from the selected month
    const selectedMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate.getMonth() === selectedMonthNumber && orderDate.getFullYear() === selectedYear;
    });

    if (selectedMonthOrders.length === 0) {
      console.log(`No orders found for the selected month.`);
      return;
    }

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(22);
    doc.text("Courier Business", 105, 10, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Invoice Period: ${getSelectedMonthPeriod(selectedMonth.value)}`, 105, 26, { align: "center" });

    selectedMonthOrders.sort((a, b) => a.deliveryCustomerId - b.deliveryCustomerId);
    doc.setFontSize(16);
    const sectionHeading = "Customer Invoices";
    const sectionHeadingWidth = doc.getStringUnitWidth(sectionHeading) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    doc.text(sectionHeading, (doc.internal.pageSize.getWidth() - sectionHeadingWidth) / 2, y);
    y += 20; 
    doc.setLineWidth(0.5);
    doc.line(10, y - 5, doc.internal.pageSize.getWidth() - 10, y - 5);

    let prevCustomerID = null;
    for (const order of selectedMonthOrders) {
      if (prevCustomerID !== null && order.deliveryCustomerId !== prevCustomerID) {
        doc.setLineWidth(0.5);
        doc.line(10, y - 5, doc.internal.pageSize.getWidth() - 10, y - 5);
        y += 10; 
      }

      const date = new Date(order.date);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      const customerName = await getCustomerName(order.deliveryCustomerId, 'delivery');
      const line = `Order ID: ${order.id}, Date: ${formattedDate}, Price: $${order.price}, Customer: ${customerName}`;
      doc.text(line, 10, y);
      y += 10;

      prevCustomerID = order.deliveryCustomerId;

      if (y > doc.internal.pageSize.getHeight() - 10) {
        doc.addPage();
        y = 20; 
      }
    }

    doc.setLineWidth(0.5);
    doc.line(10, y - 5, doc.internal.pageSize.getWidth() - 10, y - 5);

    doc.save("selected-month-invoices.pdf");
  } catch(error) {
    console.error(error);
    snackbar.value = {
      value: true,
      color: "error",
      text: "Failed to download invoices!"
    };
  }
}



function getSelectedMonthPeriod(selectedMonthNumber) {
  const now = new Date();
  const selectedMonth = now.getMonth() - selectedMonthNumber;
  const selectedYear = selectedMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
  const selectedMonthName = new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(selectedYear, selectedMonth));
  const startDate = new Date(selectedYear, selectedMonth, 1);
  const endDate = new Date(selectedYear, selectedMonth + 1, 0);

  return `${selectedMonthName} ${startDate.getDate()}-${endDate.getDate()}, ${selectedYear}`;
}




async function addCourier() {
  isAddCourier.value = false;
  delete newCourier.value.id;
  try {
    await CourierServices.addCourier(newCourier.value);
    snackbar.value = {
      value: true,
      color: 'Black',
      text: 'Added Successfully!'
    };
    getCouriers();
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: 'red',
      text: error.response.data.message
    };
  }
}

function openAddCourier() {
  console.log("openAddCourieris called");
  newCourier.value.courierNumber = undefined;
  newCourier.value.name = undefined;
  isAddCourier.value = true;
}

function closeAddCourier() {
  isAddCourier.value = false;
}

function openEditCourier(courier) {
  selectedCourier.value.id = courier.id;
  selectedCourier.value.courierNumber = courier.courierNumber;
  selectedCourier.value.name = courier.name;
  isEditCourier.value = true;
}

function closeEditCourier() {
  isEditCourier.value = false;
}

async function updateCourier() {
  try {
    const isUserCourier = isNaN(selectedCourier.value.courierNumber);
    let response;

    if (isUserCourier) {
      response = await UserServices.updateUser(selectedCourier.value);
    } else {
      response = await CourierServices.updateCourier(selectedCourier.value);
    }
    isEditCourier.value = false;
    snackbar.value = {
      value: true,
      color: "green",
      text: "Courier updated successfully!"
    };
    couriers.value = await getCouriers();
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: "error",
      text: "Failed to update courier!"
    };
  }
}

async function deleteCourier(id) {
  const confirmDialog = confirm("Are you sure you want to delete this courier?");
  if (confirmDialog) {
    try {
      await CourierServices.deleteCourier(id);
      couriers.value = couriers.value.filter(c => c.id !== id);
      snackbar.value = {
        value: true,
        color: 'success',
        text: 'Courier was successfully deleted!'
      };
    } catch (error) {
      console.log(error);
      snackbar.value = {
        value: true,
        color: 'error',
        text: 'Failed to delete courier!'
      };
    }
  }
}


async function addClerk() {
  isAddClerk.value = false;
  delete newClerk.value.id;
  try {
    await ClerkServices.addClerk(newClerk.value);
    snackbar.value = {
      value: true,
      color: 'black',
      text: 'Added Successfully!'
    };
    getClerks();
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: 'red',
      text: error.response.data.message
    };
  }
}

function openAddClerk() {
  console.log("openAddClerk is called");
  newClerk.value.clerkNumber = undefined;
  newClerk.value.name = undefined;
  isAddClerk.value = true;
}

function closeAddClerk() {
  isAddClerk.value = false;
}

function openEditClerk(clerk) {
  selectedClerk.value.id = clerk.id;
  selectedClerk.value.clerkNumber = clerk.clerkNumber;
  selectedClerk.value.name = clerk.name;
  isEditClerk.value = true;
}

function closeEditClerk() {
  isEditClerk.value = false;
}

async function updateClerk(clerk) {
  try {
    const response = await ClerkServices.updateClerk(selectedClerk.value);
    console.log(response);
    if (response.data && Array.isArray(response.data)) {
      const updatedClerkIndex = response.data.findIndex(
        (c) => c.id === selectedClerk.value.id
      );
      if (updatedClerkIndex !== -1) {
        response.data[updatedClerkIndex] = selectedClerk.value;
      }
    }
    isEditClerk.value = false;
    snackbar.value = {
      value: true,
      color: "green",
      text: "Clerk updated successfully!"
    };
    getClerks(); 
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: "error",
      text: "Failed to update clerk!"
    };
  }
}

async function deleteClerk(id) {
  const confirmDialog = confirm("Are you sure you want to delete this clerk?");
  if (confirmDialog) {
    try {
      await ClerkServices.deleteClerk(id);
      clerks.value = clerks.value.filter(c => c.id !== id);
      snackbar.value = {
        value: true,
        color: 'green',
        text: 'Clerk was successfully deleted!'
      };
    } catch (error) {
      console.log(error);
      snackbar.value = {
        value: true,
        color: 'error',
        text: 'Failed to delete clerk!'
      };
    }
  }
}

async function addCustomer() { 
  isAddCustomer.value = false;
  delete newCustomer.value.id;
  try {
    await PickupCustomerServices.addPickupCustomer(newCustomer.value);
    snackbar.value = {
      value: true,
      color: 'black',
      text: 'Added Successfully!'
    };
    getPickupCustomers();
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: 'red',
      text: error.response.data.message
    };
  }
  try {
    await DeliveryCustomerServices.addDeliveryCustomer(newCustomer.value);
    snackbar.value = {
      value: true,
      color: 'black',
      text: 'Added Successfully!'
    };
    getDeliveryCustomers();
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: 'red',
      text: error.response.data.message
    };
  }
}

function openAddCustomer() {
  newCustomer.value.customerNumber = undefined;
  newCustomer.value.name = undefined;
  newCustomer.value.locationDescription = undefined;
  newCustomer.value.locationNode = undefined; 
  newCustomer.value.deliveryInstructions = undefined;
  isAddCustomer.value = true;
}

function closeAddCustomer() {
  isAddCustomer.value = false;
}

function openEditCustomer(customer) {
  if (customer && customer.id) {
    selectedCustomer.value.id = customer.id;
    selectedCustomer.value.customerNumber = customer.customerNumber;
    selectedCustomer.value.name = customer.name;
    selectedCustomer.value.locationDescription = customer.locationDescription;
    selectedCustomer.value.locationNode = customer.locationNode;
    selectedCustomer.value.deliveryInstructions = customer.deliveryInstructions;
    isEditCustomer.value = true;
  } else {
    console.error('Invalid customer:', customer);
  }
}



function closeEditCustomer() {
  isEditCustomer.value = false;
}

async function updateCustomer(customer) {
  try {
    await PickupCustomerServices.updatePickupCustomer(customer);
    snackbar.value = {
      value: true,
      color: 'black',
      text: 'Pickup Customer Updated Successfully!'
    };
    getPickupCustomers();
    return;
  } catch (error) {
    console.log('Error updating Pickup Customer:', error);
  }

  try {
    await DeliveryCustomerServices.updateDeliveryCustomer(customer);
    snackbar.value = {
      value: true,
      color: 'black',
      text: 'Delivery Customer Updated Successfully!'
    };
    getDeliveryCustomers();
    return;
  } catch (error) {
    console.log('Error updating Delivery Customer:', error);
    snackbar.value = {
      value: true,
      color: 'red',
      text: error.response.data.message
    };
  }
}
async function saveCustomer() {
  try {
    await updateCustomer(selectedCustomer.value);
    closeEditCustomer(); 
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: "error",
      text: "Failed to update customer!",
    };
  }
}

async function deleteCustomer(customer) {
  const confirmDialog = confirm("Are you sure you want to delete this order?");
  if (confirmDialog) {
  try {
    await PickupCustomerServices.deletePickupCustomer(customer.id);
    await DeliveryCustomerServices.deleteDeliveryCustomer(customer.id);

    if (Array.isArray(customer.value)) {
      customer.value = customer.value.filter(o => o.id !== customer.id);
    }
    
    snackbar.value = {
      value: true,
      color: 'green',
      text: 'Customer deleted successfully!'
    };
    getDeliveryCustomers();
    getPickupCustomers();
  } catch (error) {
    console.log('Error deleting customer: ', error);

    snackbar.value = {
      value: true,
      color: 'red',
      text: 'Error deleting customer. Please try again.'
    };
  }
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
  ///newOrder.value.pathId = paths.value[lastPath].id;
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
          Dashboard
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="14">
        <div class="order-container rounded p-5" style="background-color: darkgreen;">
          <v-row class="d-flex justify-space-between align-center" style="color: white;">
            <div class="d-flex align-center">
              <h2 class="mr-3">Orders</h2>
              <v-icon size="x-small" @click="openAddOrder()">
                mdi-plus
              </v-icon>
            </div>
            <div class="bill-container rounded" style="background-color: rgb(49, 117, 80);">
              <v-btn color="transparent" @click="dialog = true" style="color: white;">
  <h2>Billing</h2>
</v-btn>
            </div>
          </v-row>
        </div>
      </v-col>
    </v-row>


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

    
<v-row>
  <v-col cols="4">
    <div class="courier-container" style="background-color: darkgreen; border-radius: 15px; margin-bottom: 18px;">
      <h2 style="text-align: center; color: white;">Couriers</h2>
      <div class="icon">
        <v-icon size="x-small" @click="openAddCourier()">
          mdi-plus
        </v-icon>
      </div>
    </div>

    <v-list>
      <v-list-item v-for="courier in couriers" :key="courier.id" class="courier-item">
        <v-list-item-content class="d-flex justify-space-between align-center">
          <div>
            <v-chip small color="purple">{{ courier.name }}</v-chip>
            <v-chip small color="red">{{ courier.courierNumber }}</v-chip>
          </div>
          <div>
            <v-icon size="x-small" @click="openEditCourier(courier)">mdi-pencil</v-icon>
            <v-icon size="x-small" @click="deleteCourier(courier.id)">mdi-trash-can</v-icon>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>

<div class="clerk-container" style="background-color: darkgreen; border-radius: 15px; margin-bottom: 18px;">
  <h2 style="text-align: center; color: white;">Clerks</h2>
  <div class="icon">
    <v-icon size="x-small" @click="openAddClerk()">mdi-plus</v-icon>
  </div>
</div>
<v-list>
  <v-list-item v-for="clerk in clerks" :key="clerk.id" class="clerk-item">
    <v-list-item-content class="d-flex justify-space-between align-center">
      <div>
        <v-chip small color="purple">{{ clerk.name }}</v-chip>
        <v-chip small color="red">{{ clerk.clerkNumber }}</v-chip>
      </div>
      <div>
        <v-icon size="x-small" @click="openEditClerk(clerk)">mdi-pencil</v-icon>
        <v-icon size="x-small" @click="deleteClerk(clerk.id)">mdi-trash-can</v-icon>
      </div>
    </v-list-item-content>
  </v-list-item>
</v-list>




<v-dialog v-model="isAddClerk">
      <v-card>
        <v-card-title>Add Clerk</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addClerk">
            <v-text-field label="Clerk Number" v-model="newClerk.clerkNumber" required />
            <v-text-field label="Name" v-model="newClerk.name" required />
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="closeAddClerk">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="addClerk">Add Clerk</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isAddCustomer">
  <v-card>
    <v-card-title>Add Customer</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="addCustomer">
        <v-text-field label="Customer Number" v-model="newCustomer.customerNumber" required />
        <v-text-field label="Name" v-model="newCustomer.name" required />
        <v-text-field label="Location Description" v-model="newCustomer.locationDescription" required />
        <v-text-field label="Location Node" v-model="newCustomer.locationNode" required />
        <v-text-field label="Delivery Instructions" v-model="newCustomer.deliveryInstructions" required />
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeAddCustomer">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="addCustomer">Add Customer</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</v-dialog>
    <v-dialog v-model="isAddCourier">
      <v-card>
        <v-card-title>Add Courier</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addCourier">
            <v-text-field label="Courier Number" v-model="newCourier.courierNumber" required />
            <v-text-field label="Name" v-model="newCourier.name" required />
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="closeAddCourier">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="addCourier">Add Courier</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDelete" max-width="290">
  <v-card>
    <v-card-title class="headline">Are you sure?</v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="confirmDelete = false">No</v-btn>
      <v-btn color="red darken-1" text @click="deleteCustomer({ ...selectedCustomer, type: 'pickup' })">Yes</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
<v-snackbar v-model="snackbar.value" :color="snackbar.color" :timeout="3000" rounded="pill">
  {{ snackbar.text }}
</v-snackbar>

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

<!-- Edit Order Dialog -->
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


  <!-- Edit Courier Dialog -->
  <v-dialog v-model="isEditCourier">
    <v-card>
      <v-card-title>Edit Courier</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="updateCourier">
          <v-text-field label="Courier Number" v-model="selectedCourier.courierNumber" required />
          <v-text-field label="Name" v-model="selectedCourier.name" required />
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeEditCourier">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="updateCourier">Save</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Edit Clerk Dialog -->
<v-dialog v-model="isEditClerk">
  <v-card>
    <v-card-title>Edit Clerk</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="updateClerk">
        <v-text-field label="Clerk Number" v-model="selectedClerk.clerkNumber" required />
        <v-text-field label="Name" v-model="selectedClerk.name" required />
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeEditClerk">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="updateClerk">Save</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</v-dialog>
<!-- Edit Customer Dialog -->
<v-dialog v-model="isEditCustomer">
  <v-card>
    <v-card-title>Edit Customer</v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field label="Customer Number" v-model="selectedCustomer.customerNumber" required />
        <v-text-field label="Name" v-model="selectedCustomer.name" required />
        <v-text-field label="Location Description" v-model="selectedCustomer.locationDescription" required />
        <v-text-field label="Location Node" v-model="selectedCustomer.locationNode" required />
        <v-text-field label="Delivery Instructions" v-model="selectedCustomer.deliveryInstructions" required />
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="isEditCustomer = false">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="saveCustomer">Save</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</v-dialog>
</v-col>
      <v-col cols="8">
        <div class="customer-container" style="background-color: darkgreen; border-radius: 15px;">
  <h2 style="text-align: center; color: white;">Customers</h2>
  <div class="icon">
    <v-icon size="x-small" @click="openAddCustomer()">
      mdi-plus
    </v-icon>
  </div>
</div>

<!-- Billing Dialog -->
<v-dialog v-model="dialog" persistent max-width="600px">
  <v-card>
    <v-card-title class="text-h5">Choose Month</v-card-title>
    <v-card-text>
      <v-radio-group v-model="selectedMonth">
        <v-radio label="Last Month" value="1"></v-radio>
        <v-radio label="2 Months Ago" value="2"></v-radio>
        <v-radio label="3 Months Ago" value="3"></v-radio>
      </v-radio-group>
    </v-card-text>
    <v-card-actions>
  <v-spacer></v-spacer>
  <v-btn color="red" text @click="dialog.value = false">Close</v-btn>
  <v-btn color="green" text @click="fetchInvoicesForSelectedMonth">Download Invoices</v-btn>
</v-card-actions>

  </v-card>
</v-dialog>



<v-row>
  <v-col cols="6">
    <v-list>
      <v-list-item v-for="(customer, index) in pickupCustomers.slice(0, 5)" :key="customer.id" class="customer-item">
        <v-list-item-title class="customer-name">{{ customer.name }}</v-list-item-title>
        <v-row class="customer-row">
          <v-col cols="6" class="py-0">
            <v-list-item-subtitle>Customer Number:</v-list-item-subtitle>
          </v-col>
          <v-col cols="6" class="py-0">
            <v-list-item-subtitle>{{ customer.customerNumber }}</v-list-item-subtitle>
          </v-col>
        </v-row>
        <v-row class="customer-row">
          <v-col cols="6" class="py-0">
            <v-list-item-subtitle>Location:</v-list-item-subtitle>
          </v-col>
          <v-col cols="6" class="py-0">
            <v-list-item-subtitle>{{ customer.locationDescription }}</v-list-item-subtitle>
          </v-col>
        </v-row>
        <v-row class="customer-row">
          <v-col cols="6" class="py-0">
            <v-list-item-subtitle>Delivery:</v-list-item-subtitle>
          </v-col>
          <v-col cols="6" class="py-0">
            <v-list-item-subtitle>{{ customer.deliveryInstructions }}</v-list-item-subtitle>
          </v-col>
        </v-row>
        <v-list-item-action>
          <v-icon size="x-small" @click="openEditCustomer(customer)">
  mdi-pencil
</v-icon>
<v-icon size="x-small" @click="deleteCustomer(customer)">
  mdi-trash-can
</v-icon>


        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-col>

  <v-col cols="6">
    <v-list>
      <v-list-item v-for="(customer, index) in pickupCustomers.slice(5)" :key="customer.id" class="customer-item">
        <v-list-item-title class="customer-name">{{ customer.name }}</v-list-item-title>
        <v-row class="customer-row">
          <v-col cols="6" class="py-0">
            <v-list-item-subtitle>Customer Number:</v-list-item-subtitle>
          </v-col>
          <v-col cols="6" class="py-0">
            <v-list-item-subtitle>{{ customer.customerNumber }}</v-list-item-subtitle>
          </v-col>
        </v-row>
        <v-row class="customer-row">
          <v-col cols="6" class="py-0">
            <v-list-item-subtitle>Location:</v-list-item-subtitle>
          </v-col>
          <v-col cols="6" class="py-0">
            <v-list-item-subtitle>{{ customer.locationDescription }}</v-list-item-subtitle>
          </v-col>
        </v-row>
        <v-row class="customer-row">
          <v-col cols="6" class="py-0">
            <v-list-item-subtitle>Delivery:</v-list-item-subtitle>
          </v-col>
          <v-col cols="6" class="py-0">
            <v-list-item-subtitle>{{ customer.deliveryInstructions }}</v-list-item-subtitle>
          </v-col>
        </v-row>
        <v-list-item-action>
          <v-icon size="x-small" @click="openEditCustomer(customer)">
  mdi-pencil
</v-icon>
          <v-icon size="x-small" @click="deleteCustomer(customer)">
            mdi-trash-can
          </v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-col>
</v-row>

      </v-col>
    </v-row>
  </v-container>

</template>

<style scoped>
.customer-name {
  font-weight: bold;
  margin-bottom: 20px;
}

.customer-row {
  margin-bottom: 5px;
}

.customer-item {
  border-bottom: 2px solid black;
  padding-bottom: 10px;
  margin-bottom: 2px;
  
}

.courier-name {  
  font-weight: bold;
  margin-bottom: 5px;
}
.clerk-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.courier-row,
.clerk-row {
  margin-bottom: 5px;
}

.courier-item,
.clerk-item {
  border-bottom: 2px solid black;
  padding-bottom: px;
  margin-bottom: 2px;
}

.order-container {
  padding: 24px;
  border-radius: 30px;
  margin-bottom: 18px;
}

.courier-container  {
  padding: 10px;
  margin-bottom: 10px;
  margin-top: 30px;
  border-radius: 18px;
}
.clerk-container {
  padding: 10px;
  margin-top: 40px;
  border-radius: 18px;
}  

.customer-container {
  padding: 10px;
  border-radius: 18px;
  margin-bottom: 10px;
  margin-top: 30px;
}

.clerk-col {
  padding-right: 0; 
}

.subtitle-no-margin {
  margin-right: 0; 
}
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
  animation: scale 5s;
}

.image-container img {
  width: 500px; 
  height: 350px; 
  object-fit: cover;
  animation: scale 5s;
  border-radius: 50%;
  overflow: hidden;
}
@keyframes scale {
  0%   {transform: scale(1);}
  50%  {transform: scale(1.5);}
}
.order-detail {
  line-height: 1.5; 
  white-space: pre-line;
  margin-right: 10px; 
}
</style>