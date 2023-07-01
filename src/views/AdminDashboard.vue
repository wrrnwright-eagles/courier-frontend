<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import CourierServices from "../services/CourierServices.js";
import CustomerServices from "../services/CustomerServices.js";
import OrderServices from "../services/OrderServices.js"
import ClerkServices from "../services/ClerkServices.js";

const route = useRoute();
const couriers = ref([]);
const customers = ref([]);
const orders = ref([]);
const clerks = ref([]);
const isAdmin = ref(false);
const isAddCourier = ref(false);
const isEditCourier = ref(false);
const isAddCustomer = ref(false);
const isEditCustomer = ref(false);
const isAddClerk = ref(false);
const isEditClerk = ref(false);
const isAddOrder = ref(false);
const isEditOrder = ref(false);

const newCourier = ref({
  id: undefined,
  courierNumber: undefined,
  name: undefined,
});

const newCustomer = ref({
  id: undefined,
  customerNumber: undefined,
  name: undefined,
  location: undefined,
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
  pickup: undefined,
  delivery: undefined,
  courier: undefined,
  blocks: undefined,
  price: undefined,
})

onMounted(async () => {
  await getCustomers();
  await getCouriers();
  await getOrders();
  await getClerks();
});

// Get Methods
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

// CRUD for Couriers
async function addCourier() {
  isAddCourier.value = false;
  delete newCourier.id;
  await CourierServices.addCourier(newCourier.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newCourier.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getCouriers();
}

function openAddCourier() {
  newCourier.value.courierNumber = undefined;
  newCourier.value.name = undefined;
  isAddCourier.value = true;
}

function closeAddCourier() {
  isAddCourier.value = false;
}

function openEditCourier(courier) { // still need to figure out how to get a selected Courier from the list
  newCourier.value.id = courier.id;
  newCourier.value.courierNumber = courier.courierNumber;
  newCourier.value.name = courier.name;
  isEditCourier.value = true;
}

function closeEditCourier() {
  isEditCourier.value = false;
}

async function updateCourier(courier) {
  try {
    const response = await CourierServices.updateCourier(courier.id, courier);
    const index = response.value.findIndex(c => c.id === courier.id);
    if (index !== -1) {
      response.value[index] = courier;
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteCourier(id) {
  try {
    await CourierServices.deleteCourier(id);
    couriers.value = couriers.value.filter(c => c.id !== id);
  } catch (error) {
    console.log(error);
  }
}

// CRUD for Clerks
async function addClerk() {
  isAddClerk.value = false;
  delete newClerk.id;
  await ClerkServices.addClerk(newClerk.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newClerk.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getClerks();
}

function openAddClerk() {
  newClerk.value.clerkNumber = undefined;
  newClerk.value.name = undefined;
  isAddClerk.value = true;
}

function closeAddClerk() {
  isAddClerk.value = false;
}

function openEditClerk(item) {
  newClerk.value.id = item.id;
  newClerk.value.clerkNumber = item.clerkNumber;
  newClerk.value.name = item.name;
  isEditClerk.value = true;
}

function closeEditClerk() {
  isEditClerk.value = false;
}

async function updateClerk(clerk) {
  try {
    const response = await ClerkServices.updateClerk(clerk.id, clerk);
    const index = response.value.findIndex(c => c.id === clerk.id);
    if (index !== -1) {
      response.value[index] = clerk;
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteClerk(id) {
  try {
    await ClerkServices.deleteClerk(id);
    clerks.value = clerks.value.filter(c => c.id !== id);
  } catch (error) {
    console.log(error);
  }
}

// CRUD for Customers
async function addCustomer() {
  isAddCustomer.value = false;
  delete newCustomer.id;
  await CustomerServices.addCustomer(newCustomer.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newCustomer.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getCustomers();
}

function openAddCustomer() {
  newCustomer.value.customerNumber = undefined;
  newCustomer.value.name = undefined;
  newCustomer.value.location = undefined;
  newCustomer.value.deliveryInstructions = undefined;
  isAddCustomer.value = true;
}

function closeAddCustomer() {
  isAddCustomer.value = false;
}

function openEditCustomer(item) {
  newCustomer.value.id = item.id;
  newCustomer.value.customerNumber = item.customerNumber;
  newCustomer.value.name = item.name;
  newCustomer.value.location = item.location;
  newCustomer.value.deliveryInstructions = item.deliveryInstructions;
  isEditCustomer.value = true;
}

function closeEditCustomer() {
  isEditCustomer.value = false;
}

async function updateCustomer(customer) {
  try {
    const response = await CustomerServices.updateCustomer(customer.id, customer);
    const index = response.value.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      response.value[index] = customer;
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteCustomer(id) {
  try {
    await CustomerServices.deleteCustomer(id);
    customers.value = customers.value.filter(c => c.id !== id);
  } catch (error) {
    console.log(error);
  }
}

// CRUD for Orders
async function addOrder() {
  isAddOrder.value = false;
  delete newOrder.id;
  await OrderServices.addOrder(newOrder.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newOrder.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getOrders();
}

function openAddOrder() {
  newOrder.value.date = undefined;
  newOrder.value.time = undefined;
  newOrder.value.pickup = undefined;
  newOrder.value.delivery = undefined;
  newOrder.value.courier = undefined;
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
    const response = await OrderServices.updateOrder(order.id, order);
    const index = response.value.findIndex(o => o.id === order.id);
    if (index !== -1) {
      response.value[index] = order;
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteOrder(id) {
  try {
    await OrderServices.deleteOrder(id);
    orders.value = orders.value.filter(o => o.id !== id);
  } catch (error) {
    console.log(error);
  }
}

</script>


<template>
    <v-container>
        <v-row align="center">
            <v-col cols="12">
                <v-card-title class="pl-0 text-h4 font-weight-bold">
                Dashboard
                </v-card-title>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
              <div class="order-container">
                <h2>Orders</h2>
                <div class="icon">
                  <v-icon size="x-small" @click="openAddOrder()">
                    mdi-plus
                  </v-icon>
                </div>
                <div class="icon">
                  <v-icon size="x-small" @click="openEditOrder(item)">
                    mdi-pencil
                  </v-icon>
                </div>
                <div class="icon">
                  <v-icon size="x-small" @click="deleteOrder(item)">
                    mdi-trash-can
                  </v-icon>
                </div>
              </div>
                <v-list>
                    <v-list-item v-for="order in orders" :key="order.id">
                        <v-list-item-title>{{ order.date }} {{ order.pickup }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6">
              <div class="courier-container">
                <h2>Couriers</h2>
                <div class="icon">
                  <v-icon size="x-small" @click="openAddCourier()">
                    mdi-plus
                  </v-icon>
                </div>
                <div class="icon">
                  <v-icon size="x-small" @click="openEditCourier(courier)"> <!-- fix this -->
                    mdi-pencil
                  </v-icon>
                </div>
                <div class="icon">
                  <v-icon size="x-small" @click="deleteCourier(item)">
                    mdi-trash-can
                  </v-icon>
                </div>
              </div>
              <v-list>
                  <v-list-item v-for="courier in couriers" :key="courier.id">
                      <v-checkbox v-model="courier.selected" :label="courier.name"></v-checkbox>
                  </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="6">
              <div class="customer-container">
                <h2>Customers</h2>
                <div class="icon">
                  <v-icon size="x-small" @click="openAddCustomer()">
                    mdi-plus
                  </v-icon>
                </div>
                <div class="icon">
                  <v-icon size="x-small" @click="openEditCustomer(item)">
                    mdi-pencil
                  </v-icon>
                </div>
                <div class="icon">
                  <v-icon size="x-small" @click="deleteCustomer(item)">
                    mdi-trash-can
                  </v-icon>
                </div>
              </div>
                <v-list>
                    <v-list-item v-for="customer in customers" :key="customer.id">
                        <v-list-item-title>{{ customer.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6">
              <div class="clerk-container">
                <h2>Clerks</h2>
                <div class="icon">
                  <v-icon size="x-small" @click="openAddClerk()">
                    mdi-plus
                  </v-icon>
                </div>
                <div class="icon">
                  <v-icon size="x-small" @click="openEditClerk(item)">
                    mdi-pencil
                  </v-icon>
                </div>
                <div class="icon">
                  <v-icon size="x-small" @click="deleteClerk(item)">
                    mdi-trash-can
                  </v-icon>
                </div>
              </div>
                <v-list>
                    <v-list-item v-for="clerk in clerks" :key="clerk.id">
                        <v-list-item-title>{{ clerk.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </v-container>

    <!-- Dialog window for open and edit Courier-->
    <v-dialog persistent :model-value="isAddCourier || isEditCourier" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-item>
            <v-card-title class="headline mb-2"
              >{{ isAddCourier ? "Add Courier" : isEditCourier ? "Edit Courier" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text> <!-- fix this -->
            <v-select 
              v-model="courier"
              :items="couriers"
              item-title="courier.name"
              label="Courier"
              return-object
              multiple
              chips
            ></v-select>
            <v-text-field
              v-model="newCourier.courierNumber"
              :item="courierNumber"
              label="Courier Number"
              required
            ></v-text-field>
            <v-text-field
              v-model="newCourier.name"
              :items="name"
              label="Name"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="secondary"
              @click="isAddCourier ? closeAddCourier() : isEditCourier ? closeEditCourier() : false"
              >Close</v-btn
            >
            <v-btn
              variant="flat"
              color="primary"
              @click="
                isAddCourier ? addCourier() : isEditCourier ? updateCourier() : false
              "
              >{{
                isAddCourier ? "Add Courier" : isEditCourier ? "Update Courier" : ""
              }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

          <!-- Dialog window for open and edit Customer-->
    <v-dialog persistent :model-value="isAddCustomer || isEditCustomer" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-item>
            <v-card-title class="headline mb-2"
              >{{ isAddCustomer ? "Add Customer" : isEditCustomer ? "Edit Customer" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text> <!-- fix this -->
            <v-select
              v-model="customer"
              :items="customers"
              item-title="customer.name"
              label="Customer"
              return-object
              multiple
              chips
            ></v-select>
            <v-text-field
              v-model="newCustomer.customerNumber"
              :item="customerNumber"
              label="Customer Number"
              required
            ></v-text-field>
            <v-text-field
              v-model="newCustomer.name"
              :items="name"
              label="Customer Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="newCustomer.location"
              :items="location"
              label="Customer Location"
              required
            ></v-text-field>
            <v-text-field
              v-model="newCustomer.deliveryInstructions"
              :items="deliveryInstructions"
              label="Customer Delivery Instructions"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="secondary"
              @click="isAddCustomer ? closeAddCustomer() : isEditCustomer ? closeEditCustomer() : false"
              >Close</v-btn
            >
            <v-btn
              variant="flat"
              color="primary"
              @click="
                isAddCustomer ? addCustomer() : isEditCustomer ? updateCustomer() : false
              "
              >{{
                isAddCustomer ? "Add Customer" : isEditCustomer ? "Update Customer" : ""
              }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

          <!-- Dialog window for open and edit Clerk-->
    <v-dialog persistent :model-value="isAddClerk || isEditClerk" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-item>
            <v-card-title class="headline mb-2"
              >{{ isAddClerk ? "Add Clerk" : isEditClerk ? "Edit Clerk" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text> <!-- fix this -->
            <v-select
              v-model="clerk"
              :items="clerks"
              item-title="clerk.name"
              label="Clerk"
              return-object
              multiple
              chips
            ></v-select>
            <v-text-field
              v-model="newClerk.clerkNumber"
              :item="clerkNumber"
              label="Clerk Number"
              required
            ></v-text-field>
            <v-text-field
              v-model="newClerk.name"
              :items="name"
              label="Name"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="secondary"
              @click="isAddClerk ? closeAddClerk() : isEditClerk ? closeEditClerk() : false"
              >Close</v-btn
            >
            <v-btn
              variant="flat"
              color="primary"
              @click="
                isAddClerk ? addClerk() : isEditClerk ? updateClerk() : false
              "
              >{{
                isAddClerk ? "Add Clerk" : isEditClerk ? "Update Clerk" : ""
              }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>


</template>
