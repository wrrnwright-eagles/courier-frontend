<script setup>
import ocLogo from "/oc_logo.png";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";


const router = useRouter();
const user = ref(null);
const title = ref("Courier Delivery System");
const logoURL = ref("");


onMounted(async () => {
  logoURL.value = ocLogo;
  user.value = JSON.parse(localStorage.getItem("user"));
});


function logout() {
  UserServices.logoutUser()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  localStorage.removeItem("user");
  window.localStorage.removeItem("courierId");
  user.value = null;
  router.push({ name: "login" });
}

function handleProfilePictureUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      user.value.profilePicture = e.target.result;
      // Assuming you have a service to update the user's profile picture,
      // you can call it here, passing the 'user' object
    };
    reader.readAsDataURL(file);
  }
</script>

<template>
  <div class="gradient-background">
    <v-app-bar color="green" app dark>
      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="user === null" class="mx-2" :to="{ name: 'login' }">
        Login
      </v-btn>
      <v-btn v-if="user !== null && user.isAdmin" class="mx-2" :to="{ name: 'dashboard' }">
        Dashboard
      </v-btn>
      <v-btn v-if="user !== null && user.isCourier" class="mx-2" :to="{ name: 'courierdashboard' }">
        Dashboard
      </v-btn>
      <v-btn v-if="user !== null && user.isClerk" class="mx-2" :to="{ name: 'clerkdashboard' }">
        Dashboard
      </v-btn>
      <v-menu v-if="user !== null" min-width="200px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar class="mx-auto text-center" color="green" size="large">
            <span class="white--text font-weight-bold">{{ user.profilePicture ? '' : `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` }}</span>
            <img v-if="user.profilePicture" :src="user.profilePicture" alt="Profile Picture" />
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar color="green">
              <span class="white--text text-h5">{{ user.profilePicture ? '' : `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` }}</span>
              <img v-if="user.profilePicture" :src="user.profilePicture" alt="Profile Picture" />
            </v-avatar>
            <h3>{{ `${user.firstName} ${user.lastName}` }}</h3>
            <p class="text-caption mt-1">
              {{ user.email }}
            </p>
            <input type="file" @change="handleProfilePictureUpload" accept="image/*" />
            <v-divider class="my-3"></v-divider>
            <v-btn rounded variant="text" @click="logout()">Logout</v-btn>
          </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<style scoped>
.gradient-background {
  background: linear-gradient(to bottom, rgb(172, 227, 200) , rgb(0, 255, 34));
}

</style>