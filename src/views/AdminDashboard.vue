<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import CourierServices from "../services/CourierServices.js";
import CustomerServices from "../services/CustomerServices.js";
import OrderServices from "../services/OrderServices.js"
import ClerkServices from "../services/ClerkServices.js";


const route = useRoute();
const snackbar = ref({
  value: false,
  color: '',
  text: ''
});
const couriers = ref([]);
const selectedCourier = ref({});
const isAddCourier = ref(false);
const isEditCourier = ref(false);
const isDeleteCustomer = ref(false);
const customers = ref([]);
const selectedCustomer = ref({});
const isAddCustomer = ref(false);
const isEditCustomer = ref(false);
const confirmDelete = ref(false);
const orders = ref([]);
const selectedOrder = ref({});
const isAddOrder = ref(false);
const isEditOrder = ref(false);

const clerks = ref([]);
const selectedClerk = ref({});
const isAddClerk = ref(false);
const isEditClerk = ref(false);
const isClerk = ref(false);

const isAdmin = ref(false);

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
  const confirmDialog = confirm("Are you sure you want to delete this clerk?");
  if (confirmDialog) {
    try {
      await ClerkServices.deleteClerk(id);
      clerks.value = clerks.value.filter(c => c.id !== id);
      snackbar.value = {
        value: true,
        color: 'success',
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
    await CustomerServices.addCustomer(newCustomer.value);
    snackbar.value = {
      value: true,
      color: 'black',
      text: 'Added Successfully!'
    };
    getCustomers();
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
  console.log("openAddCustomer is called");
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

function openDeleteCustomerDialog() {
  isDeleteCustomer.value = true;
}

function closeDeleteCustomerDialog() {
  isDeleteCustomer.value = false;
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
    snackbar.value = {
      value: true,
      color: 'green',
      text: 'Customer Deleted Successfully!'
    };
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: 'red',
      text: error.response.data.message
    };
  }
}

async function deleteSelectedCustomers() {
  let selectedCustomers = customers.value.filter(c => c.selected);
  for(let customer of selectedCustomers) {
    try {
      await CustomerServices.deleteCustomer(customer.id);
    } catch (error) {
      console.log(error);
      snackbar.value = {
        value: true,
        color: 'red',
        text: error.response.data.message
      };
      return;
    }
  }
  getCustomers();
  closeDeleteCustomerDialog();

  snackbar.value = {
    value: true,
    color: 'green',
    text: 'Customers Deleted Successfully!'
  };
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
  console.log("openAddOrder is called");
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

snackbar.value = {
  value: true,
  color: "green",
  text: `${newCourier.value.name} added successfully!`
};

</script>


  <template>
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
    <v-dialog v-model="isDeleteCustomer" max-width="800px">
  <v-card>
    <v-card-title>Delete Customer</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item v-for="customer in customers" :key="customer.id" class="customer-item">
          <v-checkbox v-model="customer.selected"></v-checkbox>
          <v-list-item-content>
            <v-list-item-title class="customer-name">{{ customer.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDeleteCustomerDialog">Cancel</v-btn>
<v-btn color="red darken-1" text @click="deleteSelectedCustomers">Delete Customer</v-btn>

    </v-card-text>
  </v-card>
</v-dialog>


<v-dialog v-model="confirmDelete" max-width="290">
  <v-card>
    <v-card-title class="headline">Are you sure?</v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="confirmDelete = false">No</v-btn>
      <v-btn color="red darken-1" text @click="deleteCustomer">Yes</v-btn>
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
            <v-text-field label="Date" v-model="newOrder.date" required />
            <v-text-field label="Time" v-model="newOrder.time" required />
            <v-text-field label="Pickup" v-model="newOrder.pickup" required />
            <v-text-field label="Delivery" v-model="newOrder.delivery" required />
            <v-text-field label="Courier" v-model="newOrder.courier" required />
            <v-text-field label="Customer" v-model="newOrder.customer" required />
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
  <v-container>
    <v-row align="center">
      <v-col cols="12">
        <v-card-title class="pl-0 text-h4 font-weight-bold">
          Dashboard
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="11">
        <div class="order-container rounded" style="background-color: darkgreen;">
          <h2 style="color: white;">Orders</h2>
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

    <v-list-item-action>
      <v-icon size="x-small" @click="openEditOrder(order)">
        mdi-pencil
      </v-icon>
      <v-icon size="x-small" @click="deleteOrder(order)">
        mdi-trash-can
      </v-icon>
    </v-list-item-action>
  </v-list-item>
</v-list>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
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
    <v-list-item-title class="courier-name">{{ courier.name }}</v-list-item-title>
    <v-row class="courier-row text-right">
      <v-col cols="6" class="courier-col">
        <v-list-item-subtitle>Courier Number:</v-list-item-subtitle>
      </v-col>
      <v-col cols="1" class="courier-col">
        <v-list-item-subtitle>{{ courier.courierNumber }}</v-list-item-subtitle>
      </v-col>
    </v-row>

    <v-list-item-action>
      <v-icon size="x-small" @click="openEditCourier(courier)">
        mdi-pencil
      </v-icon>
      <v-icon size="x-small" @click="deleteCourier(courier.id)">
  mdi-trash-can
</v-icon>
    </v-list-item-action>
  </v-list-item>
</v-list>

        <div class="clerk-container" style="background-color: darkgreen; border-radius: 15px; margin-bottom: 18px;">
          <h2 style="text-align: center; color: white;">Clerks</h2>
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
  <v-list-item v-for="clerk in clerks" :key="clerk.id" class="clerk-item">
    <v-list-item-title class="clerk-name">{{ clerk.name }}</v-list-item-title>
    <v-row class="clerk-row text-right">
      <v-col cols="5" class="clerk-col">
        <v-list-item-subtitle class="subtitle-no-margin">Clerk Number:</v-list-item-subtitle>
      </v-col>
      <v-col cols="1" class="clerk-col">
        <v-list-item-subtitle class="subtitle-no-margin">{{ clerk.clerkNumber }}</v-list-item-subtitle>
      </v-col>
    </v-row>

    <v-list-item-action>
      <v-icon size="x-small" @click="openEditClerk(clerk)">
        mdi-pencil
      </v-icon>
      <v-icon size="x-small" @click="deleteClerk(clerk.id)">
  mdi-trash-can
</v-icon>
    </v-list-item-action>
  </v-list-item>
</v-list>
</v-col>
      <v-col cols="8">
        <div class="customer-container" style="background-color: darkgreen; border-radius: 15px;">
  <h2 style="text-align: center; color: white;">Customers</h2>
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
    <v-icon size="x-small" @click="openDeleteCustomerDialog()">
      mdi-trash-can
    </v-icon>
  </div>
</div>

        <v-row>
          <v-col cols="6">
            <v-list>
              <v-list-item v-for="(customer, index) in customers.slice(0, 5)" :key="customer.id" class="customer-item">
                <v-list-item-title class="customer-name">{{ customer.name }}</v-list-item-title>
                <v-row class="customer-row">
                  <v-col cols="6" class="py-0">
                    <v-list-item-subtitle>Customer:</v-list-item-subtitle>
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
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="6">
            <v-list>
              <v-list-item v-for="(customer, index) in customers.slice(5)" :key="customer.id" class="customer-item">
                <v-list-item-title class="customer-name">{{ customer.name }}</v-list-item-title>
                <v-row class="customer-row">
                  <v-col cols="6" class="py-0">
                    <v-list-item-subtitle>Customer:</v-list-item-subtitle>
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
  padding: 10px;
  border-radius: 18px;
  border-radius: 18px;
}

.courier-container  {
  padding: 10px;
  margin-bottom: 1px;
  border-radius: 18px;
}
.clerk-container {
  padding: 10px;
  margin-top: 20px;
  border-radius: 18px;
}  

.customer-container {
  padding: 10px;
  border-radius: 18px;
}

.courier-col,
.clerk-col {
  padding-right: 0; /* Remove margin-right */
}

.subtitle-no-margin {
  margin-right: 0; /* Remove margin-right for subtitles */
}
</style>
