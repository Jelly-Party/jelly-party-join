import Vue from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { BButton } from "bootstrap-vue";

// Add components globally
Vue.component("b-button", BButton);

//Vue.config.productionTip = false;
Vue.config.devtools = true;
new Vue({
  render: h => h(App)
}).$mount("#app");
