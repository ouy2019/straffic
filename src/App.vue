<template>
  <div id="app">
    
    <router-view/>
  </div>
</template>

<script>
import jsBridge from '@/jslibs/jsBridge';
// import '../src/assets/css/style.css';s
export default {
  name: 'App'
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 0.28rem;
}
body{
  font-size: 0.28rem;
}

</style>
