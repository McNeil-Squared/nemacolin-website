import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VAvatar,
  VNavigationDrawer,
  VFooter,
  VMenu,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VCard,
  VSubheader,
  VDivider,
  VExpansionPanel,
  VTextField,
  VTextarea,
  VAlert,
  transitions
} from 'vuetify'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VAvatar,
    VNavigationDrawer,
    VFooter,
    VMenu,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VCard,
    VSubheader,
    VDivider,
    VExpansionPanel,
    VTextField,
    VTextarea,
    VAlert,
    transitions
  },
  theme: {
    primary: '#ba1b1d',
    secondary: '#a31621',
    accent: '#161925',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  iconfont: 'md'
})
