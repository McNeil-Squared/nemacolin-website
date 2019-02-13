<template lang="pug">
  div
    h3.headline.text-xs-center.mb-4.primary--text Nemacolin Files
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
        //- a(:href="file.path") {{ file.name }}
        //- v-btn(color="primary" @click="getFiles") Get Files
        //- input(type="file" id="file" ref="file" @change="fileChange()")
        //- v-btn(color="primary" @click="uploadFile()") Upload File
</template>

<script>
import firebase from '../firebase.js'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      documents: [],
      file: '',
      upload: { name: '', file: '' }
    }
  },
  methods: {
    getFiles () {
      firebase.firestore().collection('files').get()
        .then((result) => {
          result.forEach(file => {
            let fileData = file.data()
            let uploaded = new Date(fileData.uploaded.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            if (this.documents.find(folder => folder.name === fileData.folder)) {
              let folder = this.documents.find(folder => folder.name === fileData.folder)
              folder.files.push({ name: fileData.name, uploaded: uploaded, url: fileData.url, docRef: fileData.docRef })
            } else {
              this.documents.push({ name: fileData.folder, files: [ { name: fileData.name, uploaded: uploaded, url: fileData.url, docRef: fileData.docRef } ] })
            }
          })
        })
        .catch((error) => { console.log(error) })
    },
    fileChange () {
      this.file = this.$refs.file.files[0]
    },
    uploadFile () {
      let storageRef = firebase.storage().ref(this.file.name)
      let metadata = { title: 'Landlord Application' }
      storageRef.put(this.file, metadata)
        .then((snapshot) => {
          snapshot.ref.getDownloadURL()
            .then((url) => {
              console.log(url)
            })
        })
      console.log(storageRef.name)
    },
    deleteFile (docRef) {
      console.log(docRef)
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
