<template lang="pug">
  v-footer(app color='primary' height='48')
    p &copy;2018 Nemacolin Inc
    v-spacer
    div.mr-4
      v-btn.white--text(flat href="tel:724-320-2750")
        v-icon fas fa-phone
        span.white--text.ml-3 724-320-2750
</template>

<style lang="scss" scoped>
  p {
    margin-top: 1.25rem;
    margin-left: 1.5rem;
    color: #fff;
  }
</style>