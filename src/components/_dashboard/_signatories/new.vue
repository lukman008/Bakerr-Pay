<template>
  <v-form lazy-validation v-model="validSignatory" ref="_form">
    <v-container fluid>
        <v-layout row wrap>
             <v-flex xs12>
                <v-text-field :rules="emailRules" v-model="signatory.email" color="accent" label="Signatory email">

                </v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-combobox
                    color="accent"
                    v-model="signatory.type"
                    :items="types"
                    label="Authorization level"
                    required
                    :rules="reqRules"
                    ></v-combobox>
            </v-flex>
            <v-flex xs12 >
                <v-text-field :rules="bvnRules" counter="11" type="tel"  v-model="signatory.bvn" color="accent" label="Bank Verification Number">

                </v-text-field>
            </v-flex>
            
        </v-layout>
    </v-container>
  </v-form>
</template>
<script>
import axios from "axios";
export default {
  name: "NewSignatory",
  methods: {
    collect() {
      if (this.$refs._form.validate()) {
          return this.signatory;
      }
    },
  
  },
  data() {
    return {
        signatory:{
            bvn:''
        },
      validSignatory: false,
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
      bvnRules: [validAccount => !!validAccount || "BVN is required",
       v => v.length == 11 || 'BVN must be 11 characters'],
      types: ["REGULAR", "SUPER"]
    };
  }
};
</script>
