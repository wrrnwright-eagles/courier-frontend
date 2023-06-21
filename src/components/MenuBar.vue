<script setup>
import ocLogo from "/oc_logo.png";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";
import ItineraryServices from "../services/ItineraryServices"; // import ItineraryServices

const router = useRouter();
const user = ref(null);
const title = ref("Team 4 Travel Itinerary");
const logoURL = ref("");
const archivedItineraries = ref([]); // create a ref for archived itineraries

onMounted(async () => {
  logoURL.value = ocLogo;
  user.value = JSON.parse(localStorage.getItem("user"));
  await getArchivedItineraries(); // fetch archived itineraries on mount
});

async function getArchivedItineraries() {
  try {
    const response = await ItineraryServices.getArchivedItineraries();
    archivedItineraries.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

function logout() {
  UserServices.logoutUser()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  localStorage.removeItem("user");
  user.value = null;
  router.push({ name: "login" });
}
</script>

<template>
  <div class="gradient-background">
        <!-- Archived Itineraries Section -->
        <div v-if="user !== null && user.isAdmin">
      <v-card class="mb-5" color="grey lighten-3">
        <v-card-title>
          <v-chip v-if="itinerary && itinerary.isArchived" class="ma-2" color="secondary" label>
  <v-icon start icon="mdi-archive"></v-icon>
  Archived
</v-chip>
          Archived Itineraries
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(itinerary, i) in archivedItineraries" :key="i">
              {{ itinerary.name }}
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </div>
    <v-app-bar color="navy" app dark>
      <router-link :to="{ name: 'itineraries' }">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
        ></v-img>
      </router-link>
      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="mx-2" :to="{ name: 'itineraries' }"> Itineraries </v-btn>
      <v-btn v-if="user === null" class="mx-2" :to="{ name: 'login' }">
        Login
      </v-btn>
      <v-btn v-if="user !== null && user.isAdmin" class="mx-2" :to="{ name: 'pastTrips' }">
        Past Trips
      </v-btn>
      <v-btn v-if="user !== null && user.isAdmin" class="mx-2" :to="{ name: 'activities' }">
        Activities
      </v-btn>
      <v-btn v-if="user !== null && user.isAdmin" class="mx-2" :to="{ name: 'flights' }">
        Flights
      </v-btn>
      <v-btn v-if="user !== null && user.isAdmin" class="mx-2" :to="{ name: 'hotels' }">
        Hotels
      </v-btn>
      <v-menu v-if="user !== null" min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar class="mx-auto text-center" color="accent" size="large">
              <span class="white--text font-weight-bold">{{
                `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="accent">
                <span class="white--text text-h5">{{
                  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                }}</span>
              </v-avatar>
              <h3>{{ `${user.firstName} ${user.lastName}` }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="logout()"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<style scoped>
.gradient-background {
  background: linear-gradient(to right, lightblue , blue);
}
</style>