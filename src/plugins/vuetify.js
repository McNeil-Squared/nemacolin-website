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
    primary: '#0e54ce',
    secondary: '#a31621',
    accent: '#3ddc97',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  iconfont: 'md'
})
