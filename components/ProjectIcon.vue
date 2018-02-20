<template>
  <img :src="" />
</template>

<script>
  import Vue from "vue"
  import Component from "nuxt-class-component"
  import {Prop} from "vue-property-decorator"

  @Component({})
  export default class Tag extends Vue {
    @Prop() pluginId;

    get iconLink() {
      return ""
    }
  }
</script>

<style lang="scss">
</style>
