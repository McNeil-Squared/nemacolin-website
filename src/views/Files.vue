<template lang="pug">
  div
    h3.headline.text-xs-center.mb-4.primary--text Nemacolin Files
    v-btn(fab fixed bottom right color="primary" @click="toggleAddFileModal")
      v-icon fas fa-plus
    v-layout(row wrap)
      v-flex(xs12 md8 offset-md2)
        v-card
          v-list(two-line)
            v-list-group(v-for="folder in documents" :key="folder.name" prepend-icon="far fa-folder")
              v-list-tile(slot="activator")
                v-list-tile-content
                  v-list-tile-title {{ folder.name }}
              v-list-tile(v-for="file in folder.files" :key="file.name")
                v-list-tile-avatar
                  v-icon(color="primary") far fa-file-pdf
                v-list-tile-content
                  a(:href="file.url" target="new")
                    v-list-tile-title.secondary--text {{ file.name }}
                    v-list-tile-sub-title {{ file.uploaded }}
                v-list-tile-action(v-if="role === 'admin'")
                  v-btn(color="primary" @click="deleteFile(file.docRef)") Delete
    AddFile(:folderList="folderList")
</template>

<script>
import firebase from '../firebase.js'
import { mapState } from 'vuex'

import AddFile from '../components/AddFile'

export default {
  data () {
    return {
      documents: [],
      showAddFileModal: false,
      folderList: []
    }
  },
  components: { AddFile },
  methods: {
    getFiles () {
      this.documents = []
      firebase.firestore().collection('files').get()
        .then((result) => {
          result.forEach(file => {
            let fileData = file.data()
            let uploaded = new Date(fileData.uploaded.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            if (this.documents.find(folder => folder.name === fileData.folder)) {
              let folder = this.documents.find(folder => folder.name === fileData.folder)
              folder.files.push({ name: fileData.name, uploaded: uploaded, url: fileData.url, docRef: fileData.docRef })
            } else {
              this.folderList.push(fileData.folder)
              this.documents.push({ name: fileData.folder, files: [ { name: fileData.name, uploaded: uploaded, url: fileData.url, docRef: fileData.docRef } ] })
            }
          })
        })
        .catch((error) => { console.log(error) })
    },
    toggleAddFileModal () {
      this.$store.dispatch('toggleAddFileModal')
    }
  },
  computed: {
    role () {
      if (this.user) { return this.user.role }
    },
    ...mapState(['user'])
  },
  created () {
    this.getFiles()
  }
}
</script>

<style scoped>
.v-btn--bottom:not(.v-btn--absolute) {
    bottom: 60px;
  }
.adjust-icon >>> .v-icon {
  margin-bottom: 4px;
}
</style>
