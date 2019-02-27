<template>
  <v-app >
    <v-navigation-drawer
      fixed
      app
      v-model="drawer"
    >
      <v-list dense>
        <template v-for="item in menus">
          <v-layout
            row
            v-if="item.heading"
            align-center
            :key="item.heading"
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            v-model="item.model"
            :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile

              v-for="(child, i) in item.children"
              :key="i"
              @click=" child.icon=='add' ? new_sig() : ()=>null"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-action v-else>
                <v-icon small>mdi-key</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text || child.name}}
                </v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action v-if="child.type === 'SUPER'">
                <v-icon small color="accent">verified_user</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
          <v-list-tile :to="item.to" v-else  :key="item.text">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">Bakerr Pay</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-icon>mdi-account-circle</v-icon> 
      </v-btn>
    </v-toolbar>
    <v-content style="padding:0;">
      <v-progress-linear v-if="isLoading" indeterminate color="accent"> </v-progress-linear>
          <router-view v-if="hasLoaded" v-on:reload="getSignatories()" :payments="payments" :vendors="vendors">
            
          </router-view>
          <v-container fluid  v-if="!isLoading && !hasLoaded" > 
            <v-layout align-center justify-center row layout wrap>
              <v-flex xs12 style="text-align:center;">
                <v-icon size="144">mdi-server-remove</v-icon>
               
              </v-flex>
              <v-flex xs12 style="text-align:center;">
                <p class="subheading" style="text-align:center;">
                  A network error occured, please try again
                </p>
              </v-flex>
              <v-flex style="text-align:center;" xs12>
                 <v-btn @click="getSignatories()" color="pink lighten-1 white--text">RELOAD</v-btn>
              </v-flex>
          </v-layout>
          </v-container>
    </v-content>
     <v-footer color="transparent" style="padding-bottom:30px;" fixed inset >
         <v-toolbar color="transparent" class="elevation-0" full-width>
      <v-spacer></v-spacer>
        <v-btn-toggle block v-model="current">
              <v-btn to="/vendors" block depressed color="accent" large value="vendors">
                <span v-show="$vuetify.breakpoint.mdAndUp || $route.name == 'vendors' ">VENDORS</span>
                <v-icon medium>mdi-account-multiple</v-icon>
              </v-btn>
              <v-btn to="/history" depressed block color="accent" large value="center">
                <span v-show="$vuetify.breakpoint.mdAndUp || $route.name == 'history' ">PAYMENT HISTORY</span>
                <v-icon medium>mdi-history</v-icon>
              </v-btn>
              <v-btn to='/pay'   depressed color="primary" large value="justify">
                <span v-show="$vuetify.breakpoint.mdAndUp || $route.name == 'pay' ">PAY AN INVOICE</span>
                <v-icon>mdi-cash-multiple</v-icon>
              </v-btn>
            </v-btn-toggle>
    </v-toolbar>
      </v-footer>
       <v-dialog persistent v-model="newSig" width="500">
            <v-card dark>
                <v-toolbar color="accent">
                  <v-toolbar-title>ADD NEW SIGNATORY</v-toolbar-title>
                  <v-spacer>
                    
                  </v-spacer>
                  <v-btn @click="newSig=false" icon><v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
              <v-card-text>
                <NewSig ref="new_signatory"/>
              </v-card-text>
              <v-card-actions>
                <v-spacer>
               
                </v-spacer>   <v-btn @click="retrieve()" :loading="isLoading" flat="" color="accent">
                    SUBMIT
                  </v-btn>
              </v-card-actions>
            </v-card>
            
            </v-dialog>
                <v-snackbar
      v-model="showSnack"
    >
      {{ snackText }}
      <v-btn
        dark
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>
<style scoped>
.v-btn--active {
  background-color: "#004346 !important";
  color: white;
}
</style>

<script>
import axios from "axios";
import NewSig from "./_dashboard/_signatories/new";
export default {
  components: {
    NewSig
  },
  data: () => ({
    showSnack: false,
    snackText: null,
    signatory: {},
    dialog: false,
    newSig: false,
    drawer: null,
    hasLoaded: false,
    current: null,
    isLoading: true,
    signatories: [],
    vendors: [],
    payments:[],
    menus: [
      {
        icon: "mdi-account-key",
        "icon-alt": "mdi-account-key",
        text: "Signatories",
        model: false,
        children: [
          {
            icon: "add",
            text: "Add new"
          }
        ]
      },
      { icon: "settings", text: "Settings", to: "#" },
      { icon: "chat_bubble", text: "Send feedback", to: "#" },
      { icon: "help", text: "Help", to: "#" },
      {
        icon: "mdi-logout",
        text: "Log out",
        to: "/login"
      }
    ]
  }),
  props: {
    source: String
  },
  methods: {
    new_sig() {
      this.newSig = !this.newSig;
    },
    retrieve: function() {
      let signatory = this.$refs.new_signatory.collect();
      if (!signatory) {
        return;
      }
      this.isLoading = true;
      axios
        .post("https://bakerrpay.herokuapp.com/api/signatories", signatory)
        .then(resp => {
          this.isLoading = false;
          console.log(resp);
          if (resp.data.state == "OK") {
            this.newSig = false;
            this.$refs.new_signatory.$refs._form.reset();
            this.snackText =
              "New signatory added successfully, signatory should log on to complete registration";
              this.getSignatories()
            this.showSnack = true;
          } else {
            this.newSig = false;
            this.$refs.new_signatory.$refs._form.reset();
            this.showSnack = true;
            this.snackText = resp.data.state;
          }
        })
        .catch(err => {
          this.showSnack = true;
          this.snackText = "Oooops! An error occured, try again";
          this.isLoading = false;
          console.log(err);
        });
    },
    getSignatories() {
      this.isLoading = true;
      this.hasLoaded = false;
      axios({
        url: "https://bakerrpay.herokuapp.com/api/signatories",
        method: "GET",
        withCredentials:true
      })
        .then(resp => {
          this.isLoading = false;
          // this.hasLoaded = true
          this.signatories = resp.data.payload;
          this.menus[0].children = [
          {
            icon: "add",
            text: "Add new"
          }
        ];
          this.signatories.forEach(sig => {
            this.menus[0].children.push(sig);
          });
          this.getVendors();
        })
        .catch(err => {
          this.isLoading = false;
          if(err.response.status ==403){
            this.$router.push({name:'login'})
          }
        });
    },
    getVendors() {
      this.isLoading = true;
      this.hasLoaded = false;
      axios({
        url: "https://bakerrpay.herokuapp.com/api/vendors",
        method: "GET",
        withCredentials:true
      })
        .then(resp => {
          this.vendors = resp.data.payload;
          this.getPayments()
        })
        .catch(err => {
          this.isLoading = false;
          if(err.response.status ==403){
            this.$router.push({name:'login'})
          }
        });
    },
     getPayments() {
      this.isLoading = true;
      this.hasLoaded = false;
      axios({
        url: "https://bakerrpay.herokuapp.com/api/pay",
        method: "GET",
        withCredentials:true
      })
        .then(resp => {
          this.isLoading = false;
          this.payments = resp.data.payload;
          this.hasLoaded = true;
        })
        .catch(err => {
          this.isLoading = false;
          if(err.response.status ==403){
            this.$router.push({name:'login'})
          }
        });
    }
  },
  mounted() {
    this.current = this.$route.name;
    this.getSignatories();
  }
};
</script>