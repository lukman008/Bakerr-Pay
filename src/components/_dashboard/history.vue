<template>
    <v-container fluid class="full-width">
        <v-layout row justify-start align-start wrap>
            
            <v-flex  style="padding:10px" v-for="payment in payments" xs12 :key="payment._id">
                <v-list three-line>
                    <v-list-tile >
                    <v-list-tile-avatar color="accent">
                        <v-icon color="white">mdi-arrow-up-bold</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title class="title white--text" >{{"     "+ payment.vendor.vendor_name}}</v-list-tile-title>
                        <v-list-tile-sub-title color="white--text">{{payment.narration}}</v-list-tile-sub-title>
                        <v-list-tile-sub-title class="subheading white--text"><v-icon >mdi-currency-ngn</v-icon>{{formatMoney(payment.amount)}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-list-tile-action-text>
                            {{payment.createdOn.slice(0,10)}}
                        </v-list-tile-action-text>
                        <v-icon v-if="payment.status=='success'" color="green">mdi-check-circle</v-icon>
                         <v-icon v-else-if="payment.status.toLowerCase()=='pending'" color="amber">mdi-radiobox-marked</v-icon>
                          <v-icon v-else color="red">mdi-close</v-icon>
                    </v-list-tile-action>
                </v-list-tile>
                </v-list>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default {
  props: {
    payments: {
      type: Array,
      required: true
    }
  },
  data() {
    return {};
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
    }
  },
  mounted() {
    console.log(this.payments);
  }
};
</script>
