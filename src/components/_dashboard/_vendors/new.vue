<template>
  <v-form lazy-validation v-model="validVendor" ref="_form">
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12>
                <v-text-field :rules="reqRules" v-model="vendor.vendor_name" color="accent" label="Vendor name">

                </v-text-field>
            </v-flex>
             <v-flex xs12>
                <v-text-field :rules="emailRules" v-model="vendor.email" color="accent" label="Vendor email">

                </v-text-field>
            </v-flex>
            <v-flex xs12 md6>
                <v-combobox
                    color="accent"
                    v-model="vendor.bank"
                    @change="resolve()"
                    :items="banks"
                    label="Bank name"
                    required
                    :rules="reqRules"
                    ></v-combobox>
            </v-flex>
            <v-flex xs12 md6>
                <v-text-field :rules="acctRules" counter="10" :error="!validAccount" :loading="accountLoading" :error-messages="accountErrors" :hint="vendor.account_name" persistent-hint :disabled="vendor.bank== null" @keyup="resolve()" v-model="vendor.account_number" color="accent" label="Account Number">

                </v-text-field>
            </v-flex>
             <v-flex xs12>
                <v-textarea v-model="vendor.description" :rules="reqRules" color="accent" hint="Other details about this vendor, services provided, etc" label="Description">

                </v-textarea>
            </v-flex>
            
        </v-layout>
    </v-container>
  </v-form>
</template>
<script>
import axios from "axios";
export default {
  name: "NewVendor",
  methods: {
    collect() {
      if (this.$refs._form.validate()) {
          return this.vendor;
      }
    },
    resolve() {
      this.vendor.account_name = null;
      this.validAccount = false;
      this.accountErrors = [];
      if (this.vendor.account_number == null) {
        return;
      }
      if (this.vendor.account_number.length < 10) {
        return;
      } else if (this.vendor.account_number.length < 10) {
        this.validAccount = false;
        this.accountErrors = ["Invalid NUBAN account number"];
        return;
      }
      this.accountLoading = true;
      axios
        .get(
          `https://bakerrpay.herokuapp.com/api/meta/resolve_account/${
            this.vendor.account_number
          }/${this.vendor.bank.value}`
        )
        .then(resp => {
          this.accountErrors = [];
          this.validAccount = true;
          this.vendor.account_name = resp.data.payload.account_name;
          this.accountLoading = false;
        })
        .catch(err => {
            
          this.validAccount = false;
          this.accountLoading = false;
          if(err.response.status == 400){
              this.accountErrors = ["Invalid NUBAN account number"];
          }else{
              this.accountErrors = ["Couldn't resolve account number, try again"];

          }
          
          return;
        });
    }
  },
  data() {
    return {
      vendor: {
        account_number: null
      },
      validVendor: false,
      isLoading:false,
      accountErrors: [],
      validAccount: false,
      accountLoading: false,
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ],
      reqRules: [v => !!v || "This field is required"],
      acctRules: [validAccount => !!validAccount || "Invalid NUBAN account number"],
      banks: [
        { text: "Access Bank", value: "044" },
        { text: "Citibank", value: "023" },
        { text: "Diamond Bank", value: "063" },
        { text: "Dynamic Standard Bank", value: "" },
        { text: "Ecobank Nigeria", value: "050" },
        { text: "Fidelity Bank Nigeria", value: "070" },
        { text: "First Bank of Nigeria", value: "011" },
        { text: "First City Monument Bank", value: "214" },
        { text: "Guaranty Trust Bank", value: "058" },
        { text: "Heritage Bank Plc", value: "030" },
        { text: "Jaiz Bank", value: "301" },
        { text: "Keystone Bank Limited", value: "082" },
        { text: "Providus Bank Plc", value: "101" },
        { text: "Polaris Bank", value: "076" },
        { text: "Stanbic IBTC Bank Nigeria Limited", value: "221" },
        { text: "Standard Chartered Bank", value: "068" },
        { text: "Sterling Bank", value: "232" },
        { text: "Suntrust Bank Nigeria Limited", value: "100" },
        { text: "Union Bank of Nigeria", value: "032" },
        { text: "United Bank for Africa", value: "033" },
        { text: "Unity Bank Plc", value: "215" },
        { text: "Wema Bank", value: "035" },
        { text: "Zenith Bank", value: "057" }
      ]
    };
  }
};
</script>
