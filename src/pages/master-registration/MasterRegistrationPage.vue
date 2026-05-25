<template>
  <q-page class="page-container">
    <!-- Breadcrumb -->
    <div class="page-top q-mb-lg">
      <div>
        <q-breadcrumbs class="page-breadcrumb q-mb-xs">
          <q-breadcrumbs-el
            icon="settings"
            label="ADMINISTRATION"
            class="breadcrumb-inactive"
          />
          <q-breadcrumbs-el
            label="MASTER REGISTRATION"
            class="breadcrumb-active"
          />
        </q-breadcrumbs>
        <h1 class="page-title">Tool Master Registration</h1>
      </div>

      <!-- Header Action Buttons -->
      <div class="header-actions">
        <q-btn
          outline
          no-caps
          icon="download"
          label="Download Excel Template"
          color="primary"
          class="header-btn"
          @click="handleDownloadTemplate"
        />
        <q-btn
          outline
          no-caps
          icon="upload"
          label="Upload Excel Data"
          color="primary"
          class="header-btn"
          @click="triggerFileUpload"
        />
        <q-btn
          unelevated
          no-caps
          icon="add"
          label="Register New Tool"
          class="header-btn btn-primary"
          @click="showRegisterDialog = true"
        />
        <input
          ref="fileInputRef"
          type="file"
          accept=".xlsx,.xls,.csv"
          style="display: none;"
          @change="handleFileUpload"
        />
      </div>
    </div>

    <!-- Master Cards Row -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-md-6">
        <CategoryMasterCard
          :rows="store.categories"
          :loading="store.categoriesLoading"
          @add="openCategoryDialog(null)"
          @edit="openCategoryDialog"
          @delete="openDeleteDialog('category', $event)"
        />
      </div>
      <div class="col-12 col-md-6">
        <TypeMasterCard
          :rows="store.types"
          :loading="store.typesLoading"
          @add="openTypeDialog(null)"
          @edit="openTypeDialog"
          @delete="openDeleteDialog('type', $event)"
        />
      </div>
    </div>

    <!-- Registry Database -->
    <div class="row">
      <div class="col-12">
        <RegistryDatabaseCard
          :rows="store.registries"
          :loading="store.registriesLoading"
          :pagination="store.registryPagination"
          :total="store.registryTotal"
          @edit="openRegisterDialog"
          @delete="openDeleteDialog('registry', $event)"
          @request="handleRegistryRequest"
          @filter="handleRegistryFilter"
        />
      </div>
    </div>

    <!-- Dialogs -->
    <CategoryFormDialog
      v-model="showCategoryDialog"
      :edit-item="editCategoryItem"
      @submit="handleCategorySubmit"
    />

    <TypeFormDialog
      v-model="showTypeDialog"
      :edit-item="editTypeItem"
      :category-options="store.categoryOptions"
      @submit="handleTypeSubmit"
    />

    <RegisterToolDialog
      v-model="showRegisterDialog"
      :edit-item="editRegistryItem"
      :category-options="store.categoryOptions"
      :types="store.types"
      @submit="handleRegistrySubmit"
    />

    <ConfirmDeleteDialog
      v-model="showDeleteDialog"
      :item-label="deleteItemLabel"
      @confirm="handleDeleteConfirm"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useMasterRegistrationStore } from 'stores/master-registration/useMasterRegistrationStore'

import CategoryMasterCard from 'components/master-registration/CategoryMasterCard.vue'
import TypeMasterCard from 'components/master-registration/TypeMasterCard.vue'
import RegistryDatabaseCard from 'components/master-registration/RegistryDatabaseCard.vue'
import CategoryFormDialog from 'components/master-registration/CategoryFormDialog.vue'
import TypeFormDialog from 'components/master-registration/TypeFormDialog.vue'
import RegisterToolDialog from 'components/master-registration/RegisterToolDialog.vue'
import ConfirmDeleteDialog from 'components/master-registration/ConfirmDeleteDialog.vue'

const $q = useQuasar()
const store = useMasterRegistrationStore()

// ============================================
// Dialog State
// ============================================
const showCategoryDialog = ref(false)
const editCategoryItem = ref(null)

const showTypeDialog = ref(false)
const editTypeItem = ref(null)

const showRegisterDialog = ref(false)
const editRegistryItem = ref(null)

const showDeleteDialog = ref(false)
const deleteItemLabel = ref('')
const deleteContext = ref({ type: '', item: null })

const fileInputRef = ref(null)

// ============================================
// Lifecycle
// ============================================
onMounted(async () => {
  try {
    await store.initializeData()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load data. Please refresh the page.'
    })
  }
})

// ============================================
// Category Handlers
// ============================================
function openCategoryDialog (item) {
  editCategoryItem.value = item
  showCategoryDialog.value = true
}

async function handleCategorySubmit ({ isEdit, id, data }) {
  try {
    if (isEdit) {
      await store.updateCategory(id, data)
      $q.notify({ type: 'positive', message: 'Category updated successfully' })
    } else {
      await store.createCategory(data)
      $q.notify({ type: 'positive', message: 'Category created successfully' })
    }
    showCategoryDialog.value = false
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to save category' })
  }
}

// ============================================
// Type Handlers
// ============================================
function openTypeDialog (item) {
  editTypeItem.value = item
  showTypeDialog.value = true
}

async function handleTypeSubmit ({ isEdit, id, data }) {
  try {
    if (isEdit) {
      await store.updateType(id, data)
      $q.notify({ type: 'positive', message: 'Type updated successfully' })
    } else {
      await store.createType(data)
      $q.notify({ type: 'positive', message: 'Type created successfully' })
    }
    showTypeDialog.value = false
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to save type' })
  }
}

// ============================================
// Registry Handlers
// ============================================
function openRegisterDialog (item) {
  editRegistryItem.value = item || null
  showRegisterDialog.value = true
}

async function handleRegistrySubmit ({ isEdit, id, data }) {
  try {
    if (isEdit) {
      await store.updateRegistry(id, data)
      $q.notify({ type: 'positive', message: 'Tool updated successfully' })
    } else {
      await store.createRegistry(data)
      $q.notify({ type: 'positive', message: 'Tool registered successfully' })
    }
    showRegisterDialog.value = false
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to save tool' })
  }
}

function handleRegistryRequest ({ pagination, filter }) {
  store.fetchRegistries({ pagination, filter })
}

function handleRegistryFilter (filter) {
  store.fetchRegistries({
    pagination: { ...store.registryPagination, page: 1 },
    filter
  })
}

// ============================================
// Delete Handlers
// ============================================
function openDeleteDialog (type, item) {
  deleteContext.value = { type, item }

  switch (type) {
    case 'category':
      deleteItemLabel.value = `Category: ${item.name} (${item.id})`
      break
    case 'type':
      deleteItemLabel.value = `Type: ${item.categoryName} - ${item.typeCode}`
      break
    case 'registry':
      deleteItemLabel.value = `Tool: ${item.serialNumber}`
      break
    default:
      deleteItemLabel.value = ''
  }

  showDeleteDialog.value = true
}

async function handleDeleteConfirm () {
  const { type, item } = deleteContext.value
  try {
    switch (type) {
      case 'category':
        await store.deleteCategory(item.id)
        $q.notify({ type: 'positive', message: 'Category deleted successfully' })
        break
      case 'type':
        await store.deleteType(item.id)
        $q.notify({ type: 'positive', message: 'Type deleted successfully' })
        break
      case 'registry':
        await store.deleteRegistry(item.id)
        $q.notify({ type: 'positive', message: 'Tool deleted successfully' })
        break
    }
    showDeleteDialog.value = false
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to delete item' })
  }
}

// ============================================
// Excel Handlers
// ============================================
async function handleDownloadTemplate () {
  try {
    await store.downloadTemplate()
    $q.notify({ type: 'info', message: 'Template download started' })
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to download template' })
  }
}

function triggerFileUpload () {
  fileInputRef.value?.click()
}

async function handleFileUpload (event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    $q.loading.show({ message: 'Uploading Excel data...' })
    await store.uploadExcel(file)
    $q.notify({ type: 'positive', message: 'Excel data uploaded successfully' })
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to upload Excel data' })
  } finally {
    $q.loading.hide()
    event.target.value = ''
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1e293b;
  margin: 4px 0 0;
  letter-spacing: -0.3px;
}
</style>
