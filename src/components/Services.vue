<template lang="pug">
  div
    p.title.text-xs-center.mt-2 Services
    v-layout.services--container(row wrap)
      router-link.flex.service.xs12.md2(v-for="service in services" index="service.name" tag="div" :to="service.to")
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
    justify-content: center;
    .service {
      background-color: #0354ce;
      margin: 0.25rem;
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
