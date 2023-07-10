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

const nodes = ref([]);
const edges = ref([]);

const clerks = ref([]);
const isAddClerk = ref(false);
const isEditClerk = ref(false);
const selectedClerk = ref({
  id: null,
  clerkNumber: "",
  name: "",
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
  blocks: 1,
  price: 1.5,
})

onMounted(async () => {
  await getDeliveryCustomers();
  await getPickupCustomers();
  await getCouriers();
  await getOrders();
  await getClerks();
  await getNodes();
  await getEdges();
});

// Get Methods
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
    const response = await CourierServices.updateCourier(selectedCourier.value);
    console.log(response); 
    if (response.data && Array.isArray(response.data)) {
      const updatedCourierIndex = response.data.findIndex(
        (c) => c.id === selectedCourier.value.id
      );
      if (updatedCourierIndex !== -1) {
        response.data[updatedCourierIndex] = selectedCourier.value;
      }
    }
    isEditCourier.value = false;
    snackbar.value = {
      value: true,
      color: "green",
      text: "Courier updated successfully!"
    };
    getCouriers(); 
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

async function addCustomer() { // update this
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
    const response = await CustomerServices.updateCustomer(customer);
    if (response.data && response.data.message === 'Customer was updated successfully.') {
      snackbar.value = {
        value: true,
        color: "green",
        text: "Customer updated successfully!",
      };
      getCustomers();
    } else {
      console.error("Invalid response data:", response.data);
      snackbar.value = {
        value: true,
        color: "error",
        text: "Failed to update customer!",
      };
    }
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: "error",
      text: "Failed to update customer!",
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
  newOrder.value.blocks = 1;
  newOrder.value.price = 1.5;
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
          Dashboard
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
        <v-list>
  <v-list-item v-for="order in orders" :key="order.id">
    <v-list-item-title>{{ order.date }} {{ order.pickup }}</v-list-item-title>
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
  <!-- Edit Order Dialog -->
  <v-dialog v-model="isEditOrder">
  <v-card>
    <v-card-title>Edit Order</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="updateOrder">
        <v-text-field label="Date" v-model="selectedOrder.date" required />
        <v-text-field label="Time" v-model="selectedOrder.time" required />
        <v-select label="Pickup" v-model="selectedOrder.pickupCustomerId" 
          :items="pickupCustomers" item-title="name" item-value="id" required />
        <v-select label="Delivery" v-model="selectedOrder.deliveryCustomerId" 
          :items="deliveryCustomers" item-title="name" item-value="id" required />
        <v-text-field label="Courier" v-model="selectedOrder.courier" required />
        <v-text-field label="Price" v-model="selectedOrder.price" required />
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="isEditOrder = false">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="updateOrder">Save</v-btn>
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
        <div class="clerk-container" style="background-color: darkgreen; border-radius: 15px; margin-bottom: 18px;">
          <h2 style="text-align: center; color: white;">Clerks</h2>
          <div class="icon">
            <v-icon size="x-small" @click="openAddClerk()">
              mdi-plus
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
</div>


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
  padding: 10px;
  border-radius: 30px;
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
  margin-bottom: 10px;
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
}

.image-container img {
  width: 500px; 
  height: 350px; 
  object-fit: cover;
  border-radius: 50%;
  overflow: hidden;
}
</style>