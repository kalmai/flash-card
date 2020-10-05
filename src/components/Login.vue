<template>
  <div class="loginForms">
    <form v-on:submit.prevent="login()">
      <label for="userName">Username:</label>
      <input type="text" v-model="userName" />
      <input type="submit" />
    </form>
    <p></p>
    <div>
    <button v-on:click="showRegisterForm()">register a new username</button>
    </div>
    <form v-on:submit.prevent="createNewUser()" v-if="showRegister">
      <p>do not enter a username associated with anything else</p>
      <label for="newUser">New username:</label>
      <input type="text" v-model="newUser" />
      <input type="submit" />
      <button v-on:click="showRegisterForm()">cancel</button>
    </form>
    <p></p>
    <div>
    <button v-on:click="guestLogin()">or login as a guest</button>
    </div>
  </div>
</template>

<script>
import UserService from "@/services/UserService.js";
export default {
  data() {
    return {
      userName: "",
      showRegister: false,
      newUser: "",
    };
  },
  methods: {
    login() {
      UserService.login(this.userName)
        .then((response) => {
          if (response.status) {
            this.$store.commit("SET_USERNAME", response.data.user_name);
            this.$store.commit("SET_USERID", response.data.user_id);
            this.$router.push({name: "Home"});
          }
        })
        .catch(() => {
          alert("please enter a valid username");
          this.userName = "";
        });
    },
    guestLogin() {
                    this.$store.commit("SET_USERNAME", null);
            this.$store.commit("SET_USERID", -1);
      this.$router.push({ name: "Home" });
    },
    showRegisterForm() {
      this.showRegister = !this.showRegister;
    },
    createNewUser() {
      UserService.createUser(this.newUser)
        .then((response) => {
          if (response.status) {
            alert(
              `account creation successful!\ndo not forget your username: ${this.newUser}\nor else you will need to make a new account`
            );
          }
        })
        .catch(() => {
          alert(`${this.newUser} is not available`);
          this.newUser = "";
        });
    },
  },
};
</script>

<style>
.loginForms{
  background-color: whitesmoke;
  width: 70vw;
  margin: 24px auto;
  padding: 20px;
  box-shadow: 0px 0px 2px 1px rgba(0,0,0,0.5);
}
</style>