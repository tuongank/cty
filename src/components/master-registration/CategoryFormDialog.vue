<template>
  <q-dialog v-model="dialogVisible" persistent class="master-dialog">
    <q-card>
      <q-card-section class="dialog-header">
        <div class="row items-center">
          <q-icon :name="isEdit ? 'edit' : 'add_circle'" size="24px" class="q-mr-sm" />
          {{ isEdit ? 'Edit Category' : 'Add New Category' }}
        </div>
      </q-card-section>

      <q-card-section class="dialog-body">
        <q-form ref="formRef" @submit.prevent="onSubmit" greedy>
          <q-input
            v-model="form.name"
            label="Category Name *"
            outlined
            dense
            autofocus
            :rules="[
              val => !!val || 'Category name is required',
              val => val.length >= 2 || 'Minimum 2 characters'
            ]"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="label" color="primary" />
            </template>
          </q-input>
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
          :label="isEdit ? 'Update' : 'Create'"
          color="primary"
          :loading="submitting"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  editItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const formRef = ref(null)
const submitting = ref(false)
const isEdit = ref(false)

const form = reactive({
  name: ''
})

const dialogVisible = ref(false)

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
  if (val) {
    if (props.editItem) {
      isEdit.value = true
      form.name = props.editItem.name
    } else {
      isEdit.value = false
      form.name = ''
    }
  }
})

watch(dialogVisible, (val) => {
  if (!val) emit('update:modelValue', false)
})

async function onSubmit () {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitting.value = true
  try {
    emit('submit', {
      isEdit: isEdit.value,
      id: props.editItem?.id,
      data: { name: form.name }
    })
  } finally {
    submitting.value = false
  }
}

function onCancel () {
  dialogVisible.value = false
}
</script>
