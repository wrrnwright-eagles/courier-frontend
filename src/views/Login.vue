<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";

const router = useRouter();
const isCreateAccount = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    router.push({ name: "itineraries" });
  }
});

function navigateToItineraries() {
  router.push({ name: "itineraries" });
}
 
async function createAccount() {
  await UserServices.addUser(user.value)
    .then(() => {
      snackbar.value = {
        value: true,
        color: "green",
        text: "Account created successfully!"
      };
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = {
        value: true,
        color: "error",
        text: error.response.data.message
      };
    });
}

async function login() {
  console.log("Logging in with user:", user.value);  // Add this line
  console.log(user.value);
  await UserServices.loginUser(user.value)  
    .then((data) => {
      window.localStorage.setItem("user", JSON.stringify(data.data));
      snackbar.value = {
        value: true,
        color: "green",
        text: "Login successful!"
      };
      router.push({ name: "itineraries" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = {
        value: true,
        color: "error",
        text: error.response.data.message
      };
    });
}




function openCreateAccount() {
  isCreateAccount.value = true;
}

function closeCreateAccount() {
  isCreateAccount.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}

async function forgotPassword() {
  const email = prompt("Please enter your email:");

  // Perform validation on the entered email if needed

  await UserServices.forgotPassword(email)
    .then(() => {
      snackbar.value = {
        value: true,
        color: "green",
        text: "Reset link sent to your email!",
      };
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = {
        value: true,
        color: "error",
        text: "Failed to send reset link.",
      };
    });
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Login </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="user.email"
            label="Email"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.password"
            label="Password"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="flat" color="secondary" @click="openCreateAccount()">Create Account</v-btn>
          <v-spacer></v-spacer>

          <v-btn variant="flat" color="primary" @click="login()">Login</v-btn>

          <v-btn variant="flat" color="secondary" @click="forgotPassword">Forgot Password</v-btn>
        </v-card-actions>
      </v-card>

      <v-card class="rounded-lg elevation-5 my-8">
        <v-card-title class="text-center headline">
          <v-btn class="ml-2" variant="flat" color="secondary" @click="navigateToItineraries()">View Published Itineraries</v-btn>
        </v-card-title>
      </v-card>

      <v-dialog persistent v-model="isCreateAccount" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Create Account </v-card-title>
          <v-card-text>
            <v-text-field v-model="user.firstName" label="First Name" required></v-text-field>
            <v-text-field v-model="user.lastName" label="Last Name" required></v-text-field>
            <v-text-field v-model="user.email" label="Email" required></v-text-field>
            <v-text-field v-model="user.password" label="Password" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeCreateAccount()">Close</v-btn>
            <v-btn variant="flat" color="primary" @click="createAccount()">Create Account</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
