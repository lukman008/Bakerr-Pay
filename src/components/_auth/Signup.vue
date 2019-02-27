<template>
<div>
    <div class="dummy-bg--wrapper" :style="{ 'background-image': `url(${bg}`}"></div>
       <v-app id="inspire">
        <v-content >
            <v-form ref="reg_form" class="fill-height"  v-model="valid">
            <v-slide-x-transition>
                
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">
                            <v-toolbar dark color="accent">
                                <v-toolbar-title>Register</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text style="padding:20px;">
                                <v-form>
                                     <v-text-field required :rules="emailRules" color="accent" v-model="signatory.email" prepend-icon="mdi-email"  name="email" label="Email" type="text"></v-text-field>
                                    <v-text-field required :rules="bvnRules" color="accent" v-model="signatory.bvn" prepend-icon="mdi-radiobox-blank" counter="11" name="bvn" label="Banking Verification Number" type="tel"></v-text-field>
                                    <v-text-field required :rules="passwordRules" v-model="signatory.password" color="accent" prepend-icon="lock" name="password" label="Password" id="password" type="password"></v-text-field>
                                     <v-text-field required :rules="rePasswordRule" v-model="rePassword"  color="accent" prepend-icon="lock" name="password" label="Password again" id="repassword" type="password"></v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-card-actions  style="padding:20px;">
                                <v-btn to="/login" style="text-transform:none;" flat color="white">I already have an account</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn :loading="isLoading" @click="register()" color="accent">ACTIVATE</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
                   <v-snackbar  color="pink lighten-1" 
      v-model="showSnack"
    >
      {{ snackText }}
      <v-btn
        dark
        flat
        @click="showSnack = false"
      >
        Close
      </v-btn>
    </v-snackbar>
            </v-container>
            </v-slide-x-transition>

                </v-form>
        </v-content>
    </v-app>
</div>
 
</template>

<style>
.dummy-bg--wrapper {
  height: 300px;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  background-position: left top;
  background-size: contain;
}
</style>

<script>
import bg from "@/assets/bg.png";
import axios from "axios";
export default {
  methods: {
    register() {
      if (!this.$refs.reg_form.validate()) {
        return;
      }
      this.isLoading = true;
      axios({
        url: `https://bakerrpay.herokuapp.com/api/signatories/${
          this.signatory.bvn
        }/activate`,
        method: "POST",
        data: this.signatory,
        withCredentials: true
      })
        .then(resp => {
          if (resp.status == 200) {
            this.isLoading = false;
            this.$router.push({ name: "home" });
          } else {
            this.isLoading = false;
            this.snackText = "Something went wrong activating your account, please verify your BVN with your supervisor";
            this.showSnack = true;
          }
        })
        .catch(err => {
          this.snackText = "Ooooops! A network error occured, please try again";
          this.showSnack = true;
          this.isLoading = false;
        });
    }
  },
  data() {
    return {
      valid: false,
      bg,
      signatory: {
        bvn: "",
        password: "",
        email: ""
      },
      showSnack: false,
      snackText: null,
      isLoading: false,
      passwordRules: [
        v => !!v || "Password is requred",
        v => v.length >= 8 || "Password must be at least 8 characters"
      ],
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ],
      rePassword: "",
      rePasswordRule: [
        v => !!v || "Passwords don't match",
        v => v == this.signatory.password || "Passwords don't match"
      ],
      nameRules: [
        v => !!v || "Name is required",
        v => v.length <= 10 || "Name must be less than 10 characters"
      ],
      bvnRules: [
        v => !!v || "BVN is required",
        v => v.length == 11 || "BVN must be 11 characters"
      ]
    };
  },
  props: {
    source: String
  }
};
</script>