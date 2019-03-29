<template lang="pug">
  div
    v-card.ml-2
      v-card-title(primary-title)
        h3.headline.mx-auto.primary--text Upcoming Events
    v-list(three-line).ml-2
      v-subheader November 5, 2018
      v-list-tile
        v-list-tile-avatar
          v-icon(color='primary') fas fa-chalkboard-teacher
        v-list-tile-content
          v-list-tile-title Monthly Board Meeting
          v-list-tile-sub-title UMWA Union Hall - 6:30PM
            br
            | This is a monthly board meeting for Nemacolin Inc.&nbsp;&nbsp;Board meetings are open to the public.
      v-divider
</template>

<style lang="scss">
  .v-list__tile {
    @media screen and (max-width: 500px) {
      height: 160px !important;
    }
  }
</style>
