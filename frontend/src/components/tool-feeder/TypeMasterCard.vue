<template>
  <q-card class="master-card">
    <!-- Header -->
    <div class="card-header">
      <div class="card-title">
        <q-icon name="category" class="card-icon" />
        <span>Type Master</span>
      </div>
      <q-btn
        round
        flat
        dense
        icon="add_circle"
        color="primary"
        size="md"
        @click="$emit('add')"
      >
        <q-tooltip>Add Type</q-tooltip>
      </q-btn>
    </div>

    <!-- Table -->
    <q-table
      flat
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      hide-pagination
      :rows-per-page-options="[0]"
      class="master-table"
      no-data-label="No types found"
    >
      <!-- Category column with badge -->
      <template v-slot:body-cell-category="props">
        <q-td :props="props">
          <q-badge
            :label="props.row.categoryName"
            color="primary"
            text-color="white"
            class="category-badge"
          />
        </q-td>
      </template>

      <!-- Actions column -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-xs" style="text-align: right;">
          <q-btn
            flat
            dense
            round
            icon="edit"
            color="primary"
            size="sm"
            @click="$emit('edit', props.row)"
          >
            <q-tooltip>Edit</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            icon="delete"
            color="negative"
            size="sm"
            @click="$emit('delete', props.row)"
          >
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <!-- Loading -->
      <template v-slot:loading>
        <q-inner-loading showing>
          <q-spinner-gears size="40px" color="primary" />
        </q-inner-loading>
      </template>
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import { TYPE_COLUMNS } from 'src/objects/tool-feeder'

defineProps({
  rows: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['add', 'edit', 'delete'])

const columns = TYPE_COLUMNS
</script>

<style lang="scss" scoped>
.category-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}
</style>
