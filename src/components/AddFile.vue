<template lang="pug">
  v-dialog(v-model="addFileModal" :width="width" persistent)
    form.pa-3.text-xs-center(@submit.prevent="submit")
      h4.mt-2.mb-4.text-xs-center Upload New File
      label.d-block.text-xs-left(for="name") File Name
      v-text-field#name(v-model="name" placeholder="File Name" :class="{'form-field--errors': areErrors('name')}" :error-messages="errors['name']" @input="validateField('name', 'File Name', ['required', 'name'])" solo)
      template(v-if="!showAddFolderField")
        label.d-block.text-xs-left(for="name") Folder
        v-select#folder(v-model="folder" :items="folderList" placeholder="Please Choose a Folder" :class="{'form-field--errors': areErrors('folder')}" :error-messages="errors['folder']" @change="validateField('folder', 'Folder', ['required'])" solo append-icon="fas fa-sort-down")
        v-btn.mb-3(v-if="!showAddFolderField" color="primary" @click="showAddFolderField = true") Add New Folder
      template(v-else)
        label.d-block.text-xs-left(for="newFolder") New Folder Name
        v-text-field#newFolder(v-model="newFolder" placeholder="Folder Name" :class="{'form-field--errors': areErrors('newFolder')}" :error-messages="errors['newFolder']" @input="validateField('newFolder', 'New Folder Name', ['required', 'name'])" solo :append-outer-icon="'fas fa-times'" @click:append-outer="clearAddFolderField")
      div.d-flex.text-xs-left.mt-3.mb-1
        v-btn.dont-grow(color="secondary" @click="openFileDialog") Browse Files
        span.d-inline-block.ml-2.body-2 {{ file.name || 'choose a file' }}
      input#file.d-none(type="file" ref="file" @change="addFile")
      label.d-block.text-xs-left(:key="4" for="newFolder") Tags (optional)
      v-text-field#name.d-inline-block.mr-1(v-model="tags[0]" placeholder="Tag Name" solo)
      v-text-field#name.d-inline-block.ml-1(v-model="tags[1]" placeholder="Tag Name" solo)
      v-text-field#name.d-inline-block.mr-1(v-model="tags[2]" placeholder="Tag Name" solo)
      v-text-field#name.d-inline-block.ml-1(v-model="tags[3]" placeholder="Tag Name" solo)
      v-btn(color="primary" @click="uploadFile" :loading="uploadingFile" :disabled="uploadingFile || $v.$invalid") Upload File
      v-btn.mx-3(@click="toggleAddFileModal" color="accent" :disabled="uploadingFile") Cancel
      v-alert(v-if="error && !uploadingFile" type="error" icon="fas fa-times" value="true") It looks like something went wrong.&nbsp;&nbsp;Please re-submit.
</template>

<script>
import firebase from 'firebase'
import { mapState } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, requiredIf, helpers } from 'vuelidate/lib/validators'
const name = helpers.regex('name', /^[a-zA-Z 0-9_.-]*$/)

export default {
  data () {
    return {
      name: '',
      folder: '',
      showAddFolderField: false,
      newFolder: '',
      file: '',
      tags: ['', '', '', ''],
      errors: [],
      error: false,
      width: 500,
      uploadingFile: false
    }
  },
  props: {
    folderList: { type: Array, required: true }
  },
  mixins: [validationMixin],
  validations: {
    name: { required, name },
    folder: { required: requiredIf(function () { return !this.showAddFolderField }) },
    newFolder: { required: requiredIf(function () { return this.showAddFolderField }), name },
    file: { required }
  },
  computed: mapState([ 'addFileModal' ]),
  methods: {
    openFileDialog () {
      document.getElementById('file').click()
    },
    addFile () {
      this.file = this.$refs.file.files[0]
      console.log(this.file.name)
    },
    clearAddFolderField () {
      this.showAddFolderField = false
      this.newFolder = ''
    },
    resetState () {
      this.uploadingFile = false
      this.name = ''
      this.folder = ''
      this.newFolder = ''
      this.file = ''
      this.tags = ['', '', '', '']
    },
    areErrors (field) {
      return this.errors[field] ? this.errors[field].length > 0 : false
    },
    validateField (field, label, validations) {
      this.errors[field] = []
      validations.forEach((validation) => {
        if (validation === 'required' && !this.$v[field].required) { this.errors[field].push(`${label} is required.`) }
        if (validation === 'name' && !this.$v[field].name) { this.errors[field].push(`${label} can only contain letters, numbers, spaces, underscores, or periods.`) }
      })
    },
    uploadFile () {
      if (!this.$v.$invalid) {
        this.uploadingFile = true
        let docRef = this.folder === '' ? `${this.newFolder}/${this.file.name}` : `${this.folder}/${this.file.name}`
        let databaseDocRef = docRef.replace('/', '-')
        let storageRef = firebase.storage().ref().child(docRef)
        storageRef.put(this.file)
          .then((snapshot) => {
            snapshot.ref.getDownloadURL()
              .then((url) => {
                let folder = this.showAddFolderField ? this.newFolder : this.folder
                let fileData = { file: this.file.name, docRef: docRef, folder: folder, name: this.name, url: url, tags: this.tags, uploaded: firebase.firestore.Timestamp.fromDate(new Date()) }
                firebase.firestore().collection('files').doc(databaseDocRef).set(fileData)
                  .then(() => {
                    this.$parent.getFiles()
                    this.resetState()
                    this.toggleAddFileModal()
                  })
                  .catch((error) => {
                    this.uploadingFile = false
                    this.error = true
                    console.log('file database error: ', error)
                  })
              })
              .catch((error) => {
                this.uploadingFile = false
                this.error = true
                console.log('get url reference error: ', error)
              })
          })
          .catch((error) => {
            this.uploadingFile = false
            this.error = true
            console.log('file upload error: ', error)
          })
      }
    },
    deleteFile (docRef) {
      console.log(docRef)
    },
    toggleAddFileModal () {
      this.$store.dispatch('toggleAddFileModal')
    }
  },
  created () {
    if (window.innerwidth < 500) this.width = window.innerWidth * 0.9
  }
}
</script>

<style scoped>
  #file {
    height: 0;
    width: 0;
  }
  .d-flex {
    align-items: center;
  }
  .dont-grow {
    flex-grow: 0 !important;
  }

/* fade */
.fade-enter-active { transition: opacity .5s; }
.fade-enter { opacity: 0; }
  /* page transitions */
.fade-leave-active { transition: translateY .5s; }
/* .slide-enter { opacity: 0; } */
.fade-leave-to { transform: translateY(-100%); }

</style>
