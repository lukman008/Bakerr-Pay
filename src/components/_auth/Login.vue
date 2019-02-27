<template>
<div>
    <div class="dummy-bg--wrapper" :style="{ 'background-image': `url(${bg}`}"></div>
       <v-app id="inspire">
        <v-content >
            <v-slide-x-transition>
               <v-form style="height:100%;" v-model="valid" ref="login_form">
                          <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">
                            <v-toolbar dark color="accent">
                                <v-toolbar-title>Sign in</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text style="padding:20px;">
                                <v-form>
                                    <v-text-field color="accent" v-model="auth.email" required :rules="emailRules" prepend-icon="person" name="login" label="Email" type="text"></v-text-field>
                                    <v-text-field color="accent" prepend-icon="lock" v-model="auth.password" :rules="passwordRules" name="password" label="Password" id="password" type="password"></v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-card-actions  style="padding:20px;">
                                  <v-btn to="/register" style="text-transform:none;" flat color="white">I'm new here</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn :loading="isLoading" @click="submit()" color="accent">Login</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
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
               </v-form>

            </v-slide-x-transition>
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
  background-position: right top;
  background-size: contain;
}
</style>

<script>
import bg from "@/assets/bg.png";
import axios from "axios";
export default {
  methods: {
    submit() {
      this.$refs.login_form.validate();
      this.isLoading = true;
      axios({
        url: "https://bakerrpay.herokuapp.com/api/auth/signin",
        method: "POST",
        withCredentials: true,
        data: this.auth
      })
        .then(resp => {
            console.log(resp)
            if(resp.data.state == "OK"){
                this.$router.push({name: 'home'})
            }
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response.status == 401) {
            this.snackText =
              "Email or password is incorrect";
            this.showSnack = true;
            return;
          }else if(err.response.status == 404){
               this.snackText =
              "No user found with this email address";
            this.showSnack = true;
            return;
          }
          this.snackText = "Ooooops! A network error occured, please try again";
          this.showSnack = true;
        });
    }
  },
  data: () => ({
    showSnack: false,
    snackText: null,
    valid: false,
    bg,
    drawer: null,
    emailRules: [
      v => !!v || "E-mail is required",
      v =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail must be valid"
    ],
    passwordRules: [v => !!v || "Password is required"],
    isLoading: false,
    auth: {
      email: "",
      password: ""
    }
  }),
  props: {
    source: String
  }
};
</script>