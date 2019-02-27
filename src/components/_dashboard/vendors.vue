<template>
    <v-slide-x-transition>
        <v-container fluid>
          <v-toolbar color="transparent" class="elevation-0">
            <v-spacer></v-spacer>
            <v-dialog persistent v-model="showDialog" width="500">
              <v-btn slot="activator" color="pink lighten-1 white--text">
              ADD NEW VENDOR
            </v-btn>
            <v-card>
                <v-toolbar color="accent">
                  <v-toolbar-title>ADD NEW VENDOR</v-toolbar-title>
                  <v-spacer>
                    
                  </v-spacer>
                  <v-btn @click="showDialog=false" icon><v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
              <v-card-text>
                <NewVendor ref="new_vendor" />
              </v-card-text>
              <v-card-actions>
                <v-spacer>
               
                </v-spacer>   <v-btn @click="retrieve()" :loading="isLoading" flat="" color="accent">
                    SUBMIT
                  </v-btn>
              </v-card-actions>
            </v-card>
            
            </v-dialog>
            
          </v-toolbar>
             <v-layout row wrap>
                <v-flex style="padding:10px;" xs12 v-for="item in vendors" :key="item.vendor_name">
             <v-list  three-line>
            <v-list-tile          
              
              avatar
              style="margin-top:10px;"
            >
              <v-list-tile-avatar>
                <v-icon>mdi-account-box</v-icon>
              </v-list-tile-avatar>
          
              <v-list-tile-content>
                <v-list-tile-title v-html="item.vendor_name"></v-list-tile-title>
                <v-list-tile-sub-title>{{item.description}}</v-list-tile-sub-title>
                <v-list-tile-sub-title > <v-icon small>mdi-bank</v-icon><strong>{{' '+item.bank_name+' - '+encode(item.account_number)}}</strong></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                 <v-menu offset-y>
                      <v-btn
                        slot="activator"
                        color="white--text"
                        icon
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                      <v-list>
                        <v-list-tile
                          v-for="(item, index) in actions"
                          :key="index"
                        >
                        <v-list-tile-avatar>
                          <v-icon>{{item.icon}}</v-icon>
                        </v-list-tile-avatar>
                          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile>
                        
                      </v-list>
                    </v-menu>
              </v-list-tile-action>
            </v-list-tile>

        </v-list>
          </v-flex>
             </v-layout>
         
           <v-snackbar  color="pink lighten-1" 
      v-model="showSnack"
    >
      {{ snackText }}
      <v-btn
        dark
        flat
        left
        @click="showSnack = false"
      >
        Close
      </v-btn>
    </v-snackbar>
        </v-container>
    </v-slide-x-transition>
</template>
<script>
import NewVendor from "./_vendors/new";
import axios from "axios";
export default {
  props: {
    vendors: {
      type: Array,
      required:true 
    },
  },
  components: {
    NewVendor
  },
  methods: {
    encode(str){
      return str.slice(0,3)+ '******'+ str.slice(str.length-3)
    },
    retrieve: function() {
      let vendor = this.$refs.new_vendor.collect();
      if (!vendor || !vendor.account_name) {
        return;
      }
      try {
        vendor.bank_code = vendor.bank.value;
        vendor.bank_name = vendor.bank.text;
        delete vendor.bank;
      } catch (e) {}
      this.isLoading = true;
      vendor.token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJzaWctMjBiNzFqZWhqc2hkazF5cyIsImVtYWlsIjoibWVAbHVxbWFuLmNvIiwiYnZuIjoyMjE3NzQ4NjQzOCwidHlwZSI6IlNVUEVSIiwic3RhdHVzIjoiQUNUSVZFIiwibmFtZSI6IkJFTExPIExVS01BTiIsInBhc3N3b3JkIjoiJDJiJDEwJDQxUUtROG1HSTMwc0djbjFaY3dXOWVCMHRTVVk0ZzdYQzlUYW1tVXZoYXA0dmFEbUNRMkxtIiwicGhvbmUiOiIwODA5MTI5MzEzNSIsImlhdCI6MTU1MTAwOTk3MH0.REXOTMlkAM8plV-5-Y3MuHXrVfjAkxeou5okQXDmc38";
      axios
        .post("https://bakerrpay.herokuapp.com/api/vendors", vendor)
        .then(resp => {
          this.isLoading = false;
          console.log(resp);
          if(resp.data.state=="OK"){
            this.showDialog = false;
            this.$refs.new_vendor.$refs._form.reset();
            this.snackText="New vendor added successfully"
            this.$emit('reload')  
            this.showSnack = true;
          }else{
            this.showDialog = false;
            this.$refs.new_vendor.$refs._form.reset();
            this.showSnack = true
            this.snackText = resp.data.state
          }
        })
        .catch(err => {
          this.showSnack = true;
          this.snackText  = "Oooops! An error occured, try again"
          this.isLoading = false;
          console.log(err);
        });
    }
  },
  data() {
    return {
      showDialog: false,
      isLoading: false,
      snackText:null,
      showSnack:false,
      actions:[
        {
          title: "Remove",
          icon: "mdi-delete"
        },
        {
          title: "Edit",
          icon: "mdi-pen"
        },
        {
          title: "Blacklist",
          icon: "mdi-block-helper"
        }
      ]
    };
  }
};
</script>
