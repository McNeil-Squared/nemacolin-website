<template lang="pug">
  v-flex(xs12 md9)
    v-layout(row wrap)
      v-flex(xs12 text-xs-center)
        p.subheading Services
    v-layout.services--container(row wrap)
      router-link.flex.service.xs12.md4(v-for="service in services" index="service.name" tag="div" :to="service.to")
        v-icon.mr-5(color="white") {{ service.icon }}
        p {{ service.name }}
</template>

<script>
export default {
  data () {
    return {
      services: [
        { name: 'Sewage Service', icon: 'fas fa-clipboard-list', to: '/sewage' },
        { name: 'Nemacolin Park', icon: 'fas fa-tree', to: '/park' },
        { name: 'Trash Service', icon: 'fas fa-trash', to: '/trash' },
        { name: 'Street Lights', icon: 'fas fa-lightbulb', to: '/lights' },
        { name: 'Fire Hydrants', icon: 'fas fa-fire', to: '/hydrants' },
      ]
    }
  }
}
</script>


<style lang="scss" scoped>
  .services--container {
    .service {
      background-color: #0354ce;
      margin: 0.25rem;
      flex-basis: 32.5%;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100px;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        background-color: #0464f5;
      }
      p {
        margin: 0;
        padding: 0;
        color: #fff;
        display: inline-block;
      }
    }
  }
</style>
