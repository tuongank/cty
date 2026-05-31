<template>
  <q-card class="master-card">
    <!-- Header -->
    <div class="card-header">
      <div class="card-title" style="flex-shrink: 0;">
        <q-icon name="build" class="card-icon" />
        <span>Registry Database</span>
      </div>

      <!-- Search -->
      <div class="registry-header-center">
        <q-input
          v-model="localFilter"
          dense
          outlined
          placeholder="Filter Serial No..."
          class="search-input"
          style="min-width: 220px;"
          debounce="400"
          @update:model-value="onFilterChange"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="grey-6" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="localFilter"
              name="close"
              class="cursor-pointer"
              @click="clearFilter"
            />
          </template>
        </q-input>
      </div>

      <!-- Count -->
      <div class="registry-count">
        SHOWING <strong>{{ total }}</strong> ASSETS
      </div>
    </div>

    <!-- Table -->
    <q-table
      flat
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      class="master-table"
      :pagination="pagination"
      @request="onRequest"
      no-data-label="No assets found"
    >
      <!-- Status column -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <span :class="['status-badge', getStatusClass(props.row.status)]">
            {{ props.row.status }}
          </span>
        </q-td>
      </template>

      <!-- Zone/Loc column -->
      <template v-slot:body-cell-zoneLoc="props">
        <q-td :props="props">
          <span class="zone-loc">
            <q-icon name="location_on" size="14px" color="grey-6" class="q-mr-xs" />
            {{ props.row.zoneLoc }}
          </span>
        </q-td>
      </template>

      <!-- Actions column -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn
            flat
            dense
            no-caps
            icon="edit"
            label="EDIT"
            class="action-btn btn-edit"
            @click="$emit('edit', props.row)"
          />
          <q-btn
            flat
            dense
            no-caps
            icon="delete"
            label="DEL"
            class="action-btn btn-delete"
            @click="$emit('delete', props.row)"
          />
        </q-td>
      </template>

      <!-- Bottom / Pagination -->
      <template v-slot:bottom="scope">
        <div class="row items-center full-width justify-between q-px-md q-py-sm">
          <div class="pagination-controls row items-center q-gutter-x-sm">
            <q-btn
              v-for="page in visiblePages(scope)"
              :key="page"
              :label="page"
              dense
              flat
              :class="[
                'pagination-btn',
                page === scope.pagination.page ? 'pagination-btn-active' : ''
              ]"
              @click="scope.pagination.page !== page && $emit('request', {
                pagination: { ...scope.pagination, page },
                filter: localFilter
              })"
            />
          </div>
          <div class="pagination-info">
            PAGE {{ scope.pagination.page }} OF {{ scope.pagesNumber }}
          </div>
        </div>
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
import { ref } from 'vue'
import { REGISTRY_COLUMNS, STATUS_CLASS_MAP } from 'src/objects/tool-feeder'

const props = defineProps({
  rows: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0
    })
  },
  total: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['edit', 'delete', 'request', 'filter'])

const columns = REGISTRY_COLUMNS
const localFilter = ref('')

function getStatusClass (status) {
  return STATUS_CLASS_MAP[status] || 'status-active'
}

function onFilterChange (value) {
  emit('filter', value)
}

function clearFilter () {
  localFilter.value = ''
  emit('filter', '')
}

function onRequest (requestProps) {
  emit('request', {
    pagination: requestProps.pagination,
    filter: localFilter.value
  })
}

function visiblePages (scope) {
  const current = scope.pagination.page
  const total = scope.pagesNumber
  const pages = []
  const range = 2

  for (let i = Math.max(1, current - range); i <= Math.min(total, current + range); i++) {
    pages.push(i)
  }
  return pages
}
</script>

<style lang="scss" scoped>
.registry-header-center {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  padding-left: 16px;
}

.registry-count {
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 500;
  white-space: nowrap;
  letter-spacing: 0.3px;

  strong {
    color: #1a237e;
    font-weight: 700;
  }
}

.zone-loc {
  display: inline-flex;
  align-items: center;
  color: #475569;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  gap: 2px;
}

.pagination-btn {
  min-width: 32px;
  min-height: 32px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.82rem;
  color: #64748b;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(26, 35, 126, 0.08);
    color: #1a237e;
  }

  &-active {
    background: #1a237e !important;
    color: #fff !important;
  }
}
</style>
