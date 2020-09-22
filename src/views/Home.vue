<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <Decks />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Decks from '@/components/Decks.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld,
    Decks
  }
}
</script>
