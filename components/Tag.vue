<template>
  <div class="tags" v-bind:class="{'has-addons': hasData}">
    <span class="tag" v-bind:style="{ background: color, 'border-color': color, color: getForegroundColor }">{{ name }}</span>
    <span class="tag" v-if="hasData">{{ data }}</span>
  </div>
</template>

<script>
  import Vue from "vue"
  import Component from "nuxt-class-component"
  import {Prop} from "vue-property-decorator"

  @Component({})
  export default class Tag extends Vue {
    @Prop() name;
    @Prop() data;
    @Prop() color;

    get hasData() {
      return this.data && this.data !== 'null';
    }

    get getForegroundColor() {
      let red = parseInt(this.color.substr(1,2), 16);
      let green = parseInt(this.color.substr(3,2), 16);
      let blue = parseInt(this.color.substr(5,2), 16);

      return (red * 0.299 + green * 0.587 + blue * 0.114) > 186 ? "#2f2f2f" : "#ffffff";
    }
  }
</script>

<style lang="scss">
</style>
