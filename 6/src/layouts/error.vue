<template>
  <div class="container">
    <h1>{{error.statusCode}}</h1>
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-if="error.statusCode === 403">Permission denied!</h1>
    <h1 v-else>{{error.message}}</h1>
    <nuxt-link to="/"></nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['error']
}
</script>