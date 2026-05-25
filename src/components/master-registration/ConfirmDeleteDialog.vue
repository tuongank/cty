<template>
  <q-dialog v-model="dialogVisible" persistent class="master-dialog">
    <q-card>
      <q-card-section class="dialog-header" style="background: linear-gradient(135deg, #b71c1c 0%, #c62828 100%);">
        <div class="row items-center">
          <q-icon name="warning" size="24px" class="q-mr-sm" />
          Confirm Delete
        </div>
      </q-card-section>

      <q-card-section class="dialog-body">
        <div class="text-body1 q-mb-sm">
          Are you sure you want to delete this item?
        </div>
        <div v-if="itemLabel" class="text-subtitle2 text-weight-bold q-pa-md" style="background: #fef2f2; border-radius: 8px; color: #991b1b;">
          {{ itemLabel }}
        </div>
        <div class="text-caption text-grey-7 q-mt-md">
          This action cannot be undone.
        </div>
      </q-card-section>

      <q-card-actions class="dialog-actions" align="right">
        <q-btn
          flat
          no-caps
          label="Cancel"
          color="grey-7"
          @click="dialogVisible = false"
          :disable="deleting"
        />
        <q-btn
          unelevated
          no-caps
          label="Delete"
          color="negative"
          icon="delete"
          :loading="deleting"
          @click="onConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  itemLabel: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialogVisible = ref(false)
const deleting = ref(false)

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  if (!val) {
    emit('update:modelValue', false)
    deleting.value = false
  }
})

function onConfirm () {
  deleting.value = true
  emit('confirm')
}
</script>
