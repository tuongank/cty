<template>
  <q-page class="q-pa-md dashboard-page">
    <div class="row items-center justify-between q-mb-md">
      <div class="page-title text-h6 text-weight-bold text-primary">
        TOOL MANAGEMENT > <span class="text-dark">CURRENT STATUS</span>
        <div class="text-subtitle1 text-dark q-mt-xs">Tool Status Overview</div>
      </div>
      <div>
        <q-btn outline color="primary" icon="download" label="EXPORT DATA" class="q-mr-sm" />
        <q-btn color="primary" icon="add" label="REGISTER TOOL" to="/administration/master-registration" />
      </div>
    </div>

    <!-- Top KPI Cards -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card" flat bordered>
          <q-card-section class="q-pa-sm">
            <div class="row items-center justify-between text-subtitle2 text-grey-8 text-uppercase">
              <span>Online Tools</span>
              <q-icon name="circle" color="positive" size="10px" />
            </div>
            <div class="text-h4 text-weight-bold q-mt-sm">{{ store.toolsOnline.toLocaleString() }}</div>
            <div class="text-caption text-positive q-mt-xs text-weight-medium">
              <q-icon name="trending_up" /> +12% from last shift
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card" flat bordered>
          <q-card-section class="q-pa-sm">
            <div class="row items-center justify-between text-subtitle2 text-grey-8 text-uppercase">
              <span>In Maintenance</span>
              <q-icon name="handyman" color="grey-6" size="xs" />
            </div>
            <div class="text-h4 text-weight-bold q-mt-sm">{{ store.toolsPM.toLocaleString() }}</div>
            <div class="text-caption text-grey-7 q-mt-xs">
              3 scheduled for completion today
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card" flat bordered>
          <q-card-section class="q-pa-sm">
            <div class="row items-center justify-between text-subtitle2 text-grey-8 text-uppercase">
              <span>Awaiting Repair</span>
              <q-icon name="warning_amber" color="negative" size="xs" />
            </div>
            <div class="text-h4 text-weight-bold q-mt-sm">{{ store.toolsRepair.toLocaleString() }}</div>
            <div class="text-caption text-negative q-mt-xs text-weight-bold">
              ! 5 Critical priority
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card" flat bordered>
          <q-card-section class="q-pa-sm">
            <div class="row items-center justify-between text-subtitle2 text-grey-8 text-uppercase">
              <span>Scrap Target</span>
              <q-icon name="delete_outline" color="grey-6" size="xs" />
            </div>
            <div class="text-h4 text-weight-bold q-mt-sm">{{ store.toolsScrap.toLocaleString() }}</div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Pending decommission
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Main Data Table -->
    <q-card class="dashboard-card q-mb-md" flat bordered>
      <q-card-section class="row items-center justify-between q-pb-none">
        <div class="text-subtitle1 text-weight-bold">Current Assets Floor Status</div>
        <div class="row items-center">
          <q-select outlined dense v-model="categoryFilter" :options="['ALL CATEGORIES', 'FEEDER', 'HEAD']" class="q-mr-sm" style="min-width: 150px;" />
          <q-btn flat round icon="filter_list" />
        </div>
      </q-card-section>

      <q-table
        flat
        :rows="filteredRegistries"
        :columns="columns"
        row-key="id"
        :loading="store.loading"
        :pagination="pagination"
        class="custom-table q-mt-sm"
      >
        <template v-slot:header="props">
          <q-tr :props="props" class="bg-dark text-white text-uppercase">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-weight-bold">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-toolCode="props">
          <q-td :props="props" class="text-primary text-weight-medium">
            {{ props.row.serialNumber }}
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.row.status)"
              text-color="white"
              size="sm"
              dense
              class="text-weight-bold q-px-sm"
            >
              • {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-location="props">
          <q-td :props="props" class="text-grey-8">
            <q-icon name="place" size="xs" color="grey-6" class="q-mr-xs"/>
            {{ props.row.location || 'N/A' }}
          </q-td>
        </template>
      </q-table>
    </q-card>

    <div class="row q-col-gutter-md">
      <!-- Status Change History -->
      <div class="col-12 col-md-8">
        <q-card class="dashboard-card h-100" flat bordered>
          <q-card-section class="row justify-between items-center q-pb-sm">
            <div class="text-subtitle1 text-weight-bold">Status Change History</div>
            <q-btn flat color="primary" label="VIEW FULL LOGS" size="sm" class="text-weight-bold" />
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-item v-for="log in mockHistoryLogs" :key="log.id" class="q-py-md">
              <q-item-section style="max-width: 150px;">
                <q-item-label class="text-primary text-weight-medium">{{ log.toolId }}</q-item-label>
              </q-item-section>
              <q-item-section style="max-width: 150px;">
                <q-item-label>
                  <span :class="getStatusTextColor(log.from)">{{ log.from }}</span>
                  <q-icon name="arrow_right_alt" class="q-mx-xs text-grey" />
                  <span :class="getStatusTextColor(log.to)">{{ log.to }}</span>
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold" :class="log.critical ? 'text-negative' : 'text-dark'">{{ log.reason }}</q-item-label>
                <q-item-label caption class="text-italic">{{ log.remark }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ log.date }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Maintenance Timeline Mini -->
      <div class="col-12 col-md-4">
        <q-card class="dashboard-card bg-primary text-white q-mb-md" flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">Maintenance Timeline</div>
            <div class="text-caption q-mt-sm">You have 12 tools scheduled for PM in the next 48 hours.</div>
            <div class="q-mt-md">
              <div class="row justify-between text-caption q-mb-xs">
                <span>Capacity Load</span>
                <span>85%</span>
              </div>
              <q-linear-progress value="0.85" color="white" track-color="primary-light" size="6px" />
            </div>
            <q-btn outline color="white" class="full-width q-mt-md" label="MANAGE SCHEDULE" />
          </q-card-section>
        </q-card>
        
        <q-card class="dashboard-card" flat bordered>
          <q-card-section>
            <div class="text-subtitle2 text-grey-8 text-uppercase">Facility Map Context</div>
            <div class="bg-grey-3 q-mt-sm flex flex-center" style="height: 120px; border: 1px dashed #ccc; border-radius: 4px;">
              <q-icon name="map" size="xl" color="grey-5" />
              <div class="text-grey-6 q-ml-sm">Map Visualization</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToolManagementStore } from 'src/stores/tool-management/useToolManagementStore'

const store = useToolManagementStore()
const categoryFilter = ref('ALL CATEGORIES')

const pagination = ref({
  page: 1,
  rowsPerPage: 5
})

onMounted(() => {
  store.fetchAllRegistries()
})

const columns = [
  { name: 'toolCode', label: 'TOOL CODE', field: 'serialNumber', align: 'left', sortable: true },
  { name: 'category', label: 'CATEGORY', field: 'categoryName', align: 'left', sortable: true },
  { name: 'type', label: 'TYPE', field: 'typeCode', align: 'left', sortable: true },
  { name: 'status', label: 'STATUS', field: 'status', align: 'center', sortable: true },
  { name: 'location', label: 'CURRENT LOCATION', field: 'location', align: 'left', sortable: true },
  { name: 'updatedAt', label: 'UPDATED AT', field: 'updatedDate', align: 'left', sortable: true, format: val => val ? new Date(val).toLocaleString() : 'N/A' }
]

const filteredRegistries = computed(() => {
  if (categoryFilter.value === 'ALL CATEGORIES') {
    return store.allRegistries
  }
  return store.allRegistries.filter(r => r.categoryName === categoryFilter.value)
})

function getStatusColor(status) {
  const s = status ? status.toUpperCase() : ''
  if (s === 'ACTIVE' || s === 'ONLINE') return 'positive'
  if (s === 'PM' || s === 'MAINTENANCE') return 'primary'
  if (s === 'REPAIR') return 'negative'
  if (s === 'SCRAP') return 'grey-8'
  return 'grey'
}

function getStatusTextColor(status) {
  const s = status ? status.toUpperCase() : ''
  if (s === 'ACTIVE' || s === 'ONLINE') return 'text-positive'
  if (s === 'PM' || s === 'MAINTENANCE') return 'text-primary'
  if (s === 'REPAIR') return 'text-negative'
  if (s === 'SCRAP') return 'text-grey-8'
  return 'text-grey'
}

// Mock logs
const mockHistoryLogs = [
  { id: 1, toolId: 'T-8821-M1', from: 'PM', to: 'Online', reason: 'Routine Maintenance Complete', remark: 'Blade sharpened, precision check passed.', date: 'Oct 24, 08:15', critical: false },
  { id: 2, toolId: 'T-9901-D5', from: 'Online', to: 'Repair', reason: 'Thermal Stress Detected', remark: 'Cracks observed on die face during shift change.', date: 'Oct 23, 22:40', critical: true },
  { id: 3, toolId: 'T-4500-G3', from: 'Online', to: 'PM', reason: 'Scheduled Calibration', remark: 'Semi-annual precision audit required.', date: 'Oct 23, 15:10', critical: false }
]
</script>

<style lang="scss" scoped>
.dashboard-page {
  background-color: #f5f7fb;
}

.page-title {
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.kpi-card {
  border-radius: 4px;
}

.dashboard-card {
  border-radius: 4px;
}

.custom-table {
  border-radius: 0;
}
.custom-table .q-table__top,
.custom-table .q-table__bottom,
.custom-table thead tr:first-child th {
  background-color: #0b1a30;
  color: white;
}

.h-100 {
  height: 100%;
}
</style>
