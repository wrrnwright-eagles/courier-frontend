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
  isAdmin: false,
  isClerk: false, 
  isCourier: false,
});

 
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
    text: error.response ? error.response.data.message : "An error occurred"
  };
});
}

async function login() {
  console.log("Logging in with user:", user.value);  
  console.log(user.value);
  await UserServices.loginUser(user.value)  
    .then((data) => {
      window.localStorage.setItem("user", JSON.stringify(data.data));
      if (data.data.isCourier) {
        window.localStorage.setItem("courierId", data.data.id);
      }
      snackbar.value = {
        value: true,
        color: "green",
        text: "Login successful!"
      };
      const user = data.data;
      
      // Depending on the role, route to different pages
      if(user.isClerk) {
        router.push({ name: "clerkdashboard" });
      } else if(user.isCourier) {
        router.push({ name: "courierdashboard" });
      } else if(user.isAdmin) {
        router.push({ name: "dashboard" });
      }
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
  <v-container class="login-container">
    <div id="body" class="login-wrapper">
      <v-card class="rounded-lg elevation-5 login-card">
        <v-card-title class="headline mb-2">Login</v-card-title>
        <v-card-text>
          <v-text-field v-model="user.email" label="Email" required></v-text-field>
          <v-text-field v-model="user.password" label="Password" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="flat" color="secondary" @click="openCreateAccount()">Create Account</v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="green" @click="login()">Login</v-btn>
          <v-btn variant="flat" color="secondary" @click="forgotPassword()">Forgot Password</v-btn>
        </v-card-actions>
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
            <v-btn variant="flat" color="green" @click="createAccount()">Create Account</v-btn>
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


<style>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
}

.login-wrapper {
  width: 70%;
  height: 80%; 
  padding-top: 20px;
}
</style>