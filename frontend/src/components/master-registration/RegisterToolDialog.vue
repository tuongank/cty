<template>
  <q-dialog v-model="dialogVisible" persistent class="master-dialog">
    <q-card>
      <q-card-section class="dialog-header">
        <div class="row items-center">
          <q-icon :name="isEdit ? 'edit' : 'add_circle'" size="24px" class="q-mr-sm" />
          {{ isEdit ? 'Edit Tool Registration' : 'Register New Tool' }}
        </div>
      </q-card-section>

      <q-card-section class="dialog-body">
        <q-form ref="formRef" @submit.prevent="onSubmit" greedy>
          <q-input
            v-model="form.serialNumber"
            label="Serial Number *"
            outlined
            dense
            :rules="[
              val => !!val || 'Serial number is required',
              val => val.length >= 3 || 'Minimum 3 characters'
            ]"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="qr_code" color="primary" />
            </template>
          </q-input>

          <q-select
            v-model="form.categoryId"
            :options="categoryOptions"
            label="Category *"
            outlined
            dense
            emit-value
            map-options
            :rules="[val => !!val || 'Category is required']"
            class="q-mb-md"
            @update:model-value="onCategoryChange"
          >
            <template v-slot:prepend>
              <q-icon name="category" color="primary" />
            </template>
          </q-select>

          <q-select
            v-model="form.typeCode"
            :options="filteredTypeOptions"
            label="Type *"
            outlined
            dense
            emit-value
            map-options
            :rules="[val => !!val || 'Type is required']"
            class="q-mb-md"
            :disable="!form.categoryId"
          >
            <template v-slot:prepend>
              <q-icon name="code" color="primary" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ form.categoryId ? 'No types for this category' : 'Select a category first' }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            v-model="form.zoneLoc"
            label="Zone / Location *"
            outlined
            dense
            :rules="[val => !!val || 'Zone/Location is required']"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="location_on" color="primary" />
            </template>
          </q-input>

          <q-select
            v-model="form.status"
            :options="statusOptions"
            label="Status *"
            outlined
            dense
            emit-value
            map-options
            :rules="[val => !!val || 'Status is required']"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="info" color="primary" />
            </template>
          </q-select>
        </q-form>
      </q-card-section>

      <q-card-actions class="dialog-actions" align="right">
        <q-btn
          flat
          no-caps
          label="Cancel"
          color="grey-7"
          @click="onCancel"
          :disable="submitting"
        />
        <q-btn
          unelevated
          no-caps
          :label="isEdit ? 'Update' : 'Register'"
          color="primary"
          :loading="submitting"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { TOOL_STATUS_OPTIONS } from 'src/objects/master-registration/types'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  editItem: {
    type: Object,
    default: null
  },
  categoryOptions: {
    type: Array,
    default: () => []
  },
  types: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const formRef = ref<any>(null)
const submitting = ref(false)
const isEdit = ref(false)
const statusOptions = TOOL_STATUS_OPTIONS

const form = reactive({
  serialNumber: '',
  categoryId: null as string | null,
  typeCode: null as string | null,
  zoneLoc: '',
  status: null as string | null
})

const dialogVisible = ref(false)

const filteredTypeOptions = computed(() => {
  if (!form.categoryId) return []
  return props.types
    .filter(t => t.categoryId === form.categoryId)
    .map(t => ({ label: t.typeCode, value: t.typeCode }))
})

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
  if (val) {
    if (props.editItem) {
      isEdit.value = true
      form.serialNumber = props.editItem.serialNumber
      form.categoryId = props.editItem.categoryId
      form.typeCode = props.editItem.typeCode
      form.zoneLoc = props.editItem.zoneLoc
      form.status = props.editItem.status
    } else {
      isEdit.value = false
      form.serialNumber = ''
      form.categoryId = null
      form.typeCode = null
      form.zoneLoc = ''
      form.status = null
    }
  }
})

watch(dialogVisible, (val) => {
  if (!val) emit('update:modelValue', false)
})

function onCategoryChange () {
  form.typeCode = null
}

async function onSubmit () {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitting.value = true
  try {
    const selectedCat = props.categoryOptions.find(c => c.value === form.categoryId)
    emit('submit', {
      isEdit: isEdit.value,
      id: props.editItem?.id,
      data: {
        serialNumber: form.serialNumber,
        categoryId: form.categoryId,
        categoryName: selectedCat?.label || '',
        typeCode: form.typeCode,
        zoneLoc: form.zoneLoc,
        status: form.status
      }
    })
  } finally {
    submitting.value = false
  }
}

function onCancel () {
  dialogVisible.value = false
}
</script>
