<template lang="pug">
  v-layout(row wrap).text-xs-center
    v-flex(xs12 md4)
      v-btn(color="secondary" to="/users") User Management
    v-flex(xs12 md4)
      v-btn(color="secondary" to="/timereports") Time Reports
    v-flex(xs12 md4)
      v-btn(color="secondary" to="/meetingmanagement") Meeting Management
</template>
