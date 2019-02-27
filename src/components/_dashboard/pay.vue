<template>
<v-slide-x-transition>
      <v-container fluid>
        <v-layout justify-space-around align-center row wrap>
           <v-flex xs12 md7>
            <v-form ref="invoice" >
               <v-layout row wrap>
               <v-flex xs12>
                     <v-text-field :rules="invRules" color="accent" v-model="pay.invoice" label="Invoice number *" append-outer-icon="mdi-arrow-left-bold" @click:append-outer="generateInv()">

                     </v-text-field>
                   </v-flex>
                <v-flex xs12>
                <v-combobox @change="retrieve()" :rules="reqRules"  color="accent" label="Who do you want to pay *" :items="vendors" v-model="pay.vendor">
                    <template slot="item" slot-scope="data">      
                     <div>
                        <v-list-tile
                        
                        :key="data.item.vendor_name"
                        avatar
                      >
                        <v-list-tile-avatar>
                          <v-icon>mdi-account-box</v-icon>
                        </v-list-tile-avatar>
                    
                        <v-list-tile-content>
                          <v-list-tile-title v-html="data.item.vendor_name"></v-list-tile-title>
                          <v-list-tile-sub-title > <v-icon small>mdi-bank</v-icon><strong>{{' '+data.item.bank_name+' - '+encode(data.item.account_number)}}</strong></v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                     </div>
                    </template>
                    <template slot="selection" slot-scope="data">      
                      <div>
                        <v-list-tile
          
                          :key="data.item.vendor_name"
                          avatar
                        >
                          <v-list-tile-avatar>
                            <v-icon>mdi-account-box</v-icon>
                          </v-list-tile-avatar>
                      
                          <v-list-tile-content>
                            <v-list-tile-title v-html="data.item.vendor_name"></v-list-tile-title>
                            <v-list-tile-sub-title > <v-icon small>mdi-bank</v-icon><strong>{{' '+data.item.bank_name+' - '+encode(data.item.account_number)}}</strong></v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                            
                      </div>
                        </template>
                        </v-combobox>
                   </v-flex>
                   <v-flex xs12>
                     <v-text-field label="How much do you want to pay?" :rules="amountRules" v-model="pay.amount" type="tel" color="accent" prepend-icon="mdi-currency-ngn">

                     </v-text-field>
                   </v-flex>
                   <v-flex xs12>
                     <v-textarea :rules="reqRules" v-model="pay.narration" color="accent" counter="140" label="What are you paying for? *">
                       
                     </v-textarea>
                   </v-flex>
                    <v-flex xs12>
                      <v-select :rules="reqRules" color="accent" v-model="pay.source" :item-disabled="['CREDIT/DEBIT CARD']" label="How do you want to pay" :items="methods">

                      </v-select>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field :rules="reqRules" color="accent" v-model="pay.password" label="Password" hint="Authorise payment" name="password" type="password">

                      </v-text-field>
                    </v-flex>
                   

               </v-layout>
            </v-form>
           </v-flex>
           <v-flex  style="padding-top:50px;padding-bottom-50px;" xs12 hidden-sm-and-up>
             <v-divider color="white"></v-divider>
           </v-flex>
           
           <v-flex xs12 md4>
             <v-card v-if="pay.vendor" style="margin-bottom:50px" color="transparent">
               <v-card-text >
                     <p>
                       <strong>RECEPIENT</strong>
                       </p>Pay {{pay.vendor.vendor_name}}<br>
                       <v-divider style="padding-top:15px;"></v-divider>
                    <p><strong>NARRATION</strong></p>
                    <span> {{pay.narration}} </span>
                  <p>
                    <v-divider></v-divider>
                  </p>
                  <p>
                    AMOUNT
                  </p>
                  <v-icon>mdi-currency-ngn</v-icon> <span class="display-2">{{formatMoney(pay.amount)}} </span>
               </v-card-text>
               <v-card-actions>
                 <v-spacer></v-spacer>
                 <v-btn :loading="isLoading" @click="retrieve()" color="pink lighten-1 white--text">
                   PAY
                 </v-btn>
               </v-card-actions>
             </v-card>
           </v-flex>
        </v-layout>
        <v-snackbar color="pink lighten-1" v-model="showSnack">
            {{ snackText }}
            <v-btn
              dark
              flat
              :left="true"
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </v-snackbar>
    </v-container>
</v-slide-x-transition>
</template>
<script>
import axios from "axios";
export default {
  props: {
    vendors: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      pay: {
        invoice: ""
      },
      showSnack: false,
      snackText: null,
      reqRules: [v => !!v || "This field is required"],
      invRules: [
        v => !!v || "This field is required",
        v => !isNaN(v) || "Reference must only contain numbers"
      ],
      isLoading: false,
      amountRules: [
        v => !!v || "Amount is required",
        v =>!isNaN(v) || "Invalid amount"
      ],
      methods: ["CREDIT/DEBIT CARD", "BALANCE"]
    };
  },
  methods: {
     formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(
          (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
        ).toString();
        let j = i.length > 3 ? i.length % 3 : 0;

        return (
          negativeSign +
          (j ? i.substr(0, j) + thousands : "") +
          i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
          (decimalCount
            ? decimal +
              Math.abs(amount - i)
                .toFixed(decimalCount)
                .slice(2)
            : "")
        );
      } catch (e) {
        console.log(e);
      }
    },
    encode(str) {
      return str.slice(0, 3) + "******" + str.slice(str.length - 3);
    },
    generateInv(){
      console.log("---------------")
      this.pay.invoice = Date.now()
    },
    retrieve() {
      if (!this.$refs.invoice.validate()) {
        return;
      }
      this.isLoading = true;
      this.pay.token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJzaWctMjBiNzFqZWhqc2hkazF5cyIsImVtYWlsIjoibWVAbHVxbWFuLmNvIiwiYnZuIjoyMjE3NzQ4NjQzOCwidHlwZSI6IlNVUEVSIiwic3RhdHVzIjoiQUNUSVZFIiwibmFtZSI6IkJFTExPIExVS01BTiIsInBhc3N3b3JkIjoiJDJiJDEwJDQxUUtROG1HSTMwc0djbjFaY3dXOWVCMHRTVVk0ZzdYQzlUYW1tVXZoYXA0dmFEbUNRMkxtIiwicGhvbmUiOiIwODA5MTI5MzEzNSIsImlhdCI6MTU1MTAwOTk3MH0.REXOTMlkAM8plV-5-Y3MuHXrVfjAkxeou5okQXDmc38";

      axios
        .post("https://bakerrpay.herokuapp.com/api/pay", this.pay)
        .then(resp => {
          this.isLoading = false;
          console.log(resp.data);
          this.showSnack = true;
          this.snackText = "SUCCESS: The transfer has been queued. ";
          setTimeout(() => {
            if (resp.data.payload.status) {
              this.$emit('reload')
              this.$router.push({ name: "history" });
            }
          }, 3000);
        })
        .catch(err => {
          this.isLoading = false;
          this.showSnack = true;
          console.log(err.response);
          switch (err.response.status) {
            case 403:
              this.snackText = "Payment Authorization failed.";
              break;
            case 400:
              this.snackText =
                "Something went wrong with your request, please try again.";
              break;
            case undefined || null:
              this.snackText = "An error occured, please try again";
            default:
              this.snackText = err.response.data.payload.message;
              break;
          }
        });
    }
  }
};
</script>
