<template>
  <q-page class="q-pa-md dashboard-page">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold text-dark">Scrap History</div>
        <div class="text-caption text-grey-7">Audit-ready decommissioned tool logs and scrap analytics.</div>
      </div>
      <div>
        <q-btn outline color="primary" icon="filter_list" label="Clear Filters" class="q-mr-sm" />
        <q-btn color="primary" icon="download" label="Export Scrap Report" />
      </div>
    </div>

    <!-- Top KPI & Analytics -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-8">
        <q-card class="dashboard-card h-100" flat bordered>
          <q-card-section class="row justify-between items-center q-pb-none">
            <div class="text-subtitle2 text-grey-8 text-uppercase">TOP SCRAP REASONS - YTD</div>
            <q-badge color="primary" outline label="LIVE DATA" />
          </q-card-section>
          <q-card-section class="row justify-around items-end" style="height: 100px;">
            <div class="text-center" v-for="reason in mockTopReasons" :key="reason.label">
              <div class="text-weight-bold q-mb-xs" style="font-size: 1.1rem;">{{ reason.count }}</div>
              <q-linear-progress :value="reason.value" :color="reason.color" size="4px" class="q-mb-xs" style="width: 80px;" />
              <div class="text-caption text-grey-8">{{ reason.label }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="dashboard-card h-100" flat bordered>
          <q-card-section>
            <div class="text-subtitle2 text-grey-8 text-uppercase">TOTAL SCRAPPED (Q4)</div>
            <div class="row items-center q-mt-sm">
              <div class="text-h3 text-weight-bold q-mr-sm">{{ store.toolsScrap }}</div>
              <div class="text-subtitle2 text-negative"><q-icon name="trending_up" /> +12%</div>
            </div>
            <div class="q-mt-md q-pa-sm bg-red-1 text-negative text-caption row items-center rounded-borders">
              <q-icon name="warning" size="xs" class="q-mr-xs" />
              High wear rate detected in CNC Unit 2.
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filters & Data Table -->
    <q-card class="dashboard-card" flat bordered>
      <q-card-section class="bg-white">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-3">
            <div class="text-caption text-weight-bold q-mb-xs text-uppercase">Filter by reason</div>
            <q-select outlined dense v-model="filterReason" :options="['All Reasons', 'Irreparable Damage', 'EndOfServiceLife', 'Safety Recall', 'Upgrade']" />
          </div>
          <div class="col-12 col-sm-5">
            <div class="text-caption text-weight-bold q-mb-xs text-uppercase">Date Range</div>
            <div class="row items-center no-wrap">
              <q-input outlined dense v-model="dateFrom" placeholder="mm/dd/yyyy" class="col">
                <template v-slot:append><q-icon name="event" /></template>
              </q-input>
              <span class="q-mx-sm">—</span>
              <q-input outlined dense v-model="dateTo" placeholder="mm/dd/yyyy" class="col">
                <template v-slot:append><q-icon name="event" /></template>
              </q-input>
            </div>
          </div>
          <div class="col-12 col-sm-4 text-right">
            <div class="text-caption text-weight-bold q-mb-xs text-uppercase">&nbsp;</div>
            <q-input outlined dense v-model="search" placeholder="Search Scrap ID or Tool ID...">
              <template v-slot:prepend><q-icon name="search" /></template>
              <template v-slot:after>
                <q-btn color="primary" label="Search" class="q-ml-sm" unelevated />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-table
        flat
        :rows="enrichedScrapList"
        :columns="columns"
        row-key="id"
        :loading="store.loading"
        :pagination="pagination"
        class="custom-table"
      >
        <template v-slot:header="props">
          <q-tr :props="props" class="bg-dark text-white text-uppercase">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-weight-bold">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-scrapId="props">
          <q-td :props="props" class="text-grey-8 font-monospace text-caption">
            SCR-2023-00{{ props.rowIndex + 1 }}
          </q-td>
        </template>
        
        <template v-slot:body-cell-toolId="props">
          <q-td :props="props" class="text-primary text-weight-bold">
            {{ props.row.serialNumber }}
          </q-td>
        </template>

        <template v-slot:body-cell-reason="props">
          <q-td :props="props">
            <q-icon name="circle" :color="getReasonColor(props.row.mockReason)" size="8px" class="q-mr-xs" />
            {{ props.row.mockReason }}
          </q-td>
        </template>
        
        <template v-slot:body-cell-remark="props">
          <q-td :props="props" class="text-italic text-grey-8">
            {{ props.row.mockRemark }}
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props" class="text-center">
            <q-btn flat round dense icon="visibility" color="grey-7" size="sm" @click="$q.notify('Viewing scrap details...')" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Audit Compliance Notice -->
    <div class="q-mt-md bg-blue-1 border-blue-2 q-pa-md rounded-borders row items-center">
      <div class="col-auto q-mr-md">
        <q-card flat class="bg-white q-pa-sm rounded-borders text-primary">
          <q-icon name="assignment_turned_in" size="md" />
        </q-card>
      </div>
      <div class="col">
        <div class="text-weight-bold text-dark">Audit Compliance Notice</div>
        <div class="text-caption text-grey-8 q-mt-xs">
          This scrap history is maintained in accordance with ISO 9001:2015 asset management standards. Any modification to decommissioned records is logged in the system master audit trail. Ensure all physical scrap tags match the Scrap ID listed above before material disposal.
        </div>
      </div>
      <div class="col-auto">
        <q-img src="https://via.placeholder.com/100x80?text=DEPT:+WASTE+MGT" style="width: 100px; height: 80px;" class="rounded-borders" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { QTableProps } from 'quasar'
import { useMasterRegistrationStore } from 'src/stores/useMasterRegistrationStore'

const store = useMasterRegistrationStore()

const filterReason = ref('All Reasons')
const dateFrom = ref('')
const dateTo = ref('')
const search = ref('')

const pagination = ref({
  page: 1,
  rowsPerPage: 5
})

onMounted(() => {
  store.fetchAllRegistries()
})

const columns: QTableProps['columns'] = [
  { name: 'scrapId', label: 'SCRAP ID', field: 'scrapId', align: 'left' },
  { name: 'toolId', label: 'TOOL ID (CODE)', field: 'serialNumber', align: 'left' },
  { name: 'reason', label: 'SCRAP REASON', field: 'mockReason', align: 'left' },
  { name: 'date', label: 'SCRAP DATE', field: 'updatedDate', align: 'left', format: (val: string) => val ? new Date(val).toISOString().split('T')[0] : '2023-11-20' },
  { name: 'createdBy', label: 'CREATED BY', field: 'mockCreatedBy', align: 'left' },
  { name: 'remark', label: 'REMARK', field: 'mockRemark', align: 'left' },
  { name: 'action', label: 'ACTION', field: 'action', align: 'center' }
]

// Mock data generator for missing fields
const mockReasons = ['Irreparable Damage', 'EndOfServiceLife', 'Safety Recall', 'Upgrade']
const mockRemarks = ['Fracture in primary housing.', 'Precision below tolerance.', 'Manufacturer bulletin 09-A.', 'Replaced by G2 series.']
const mockAuthors = ['Marcus Chen', 'Sarah Miller', 'Robert Vance', 'Alex Wong']

const enrichedScrapList = computed(() => {
  return store.scrapList.map((item, index) => {
    return {
      ...item,
      mockReason: mockReasons[index % mockReasons.length],
      mockRemark: mockRemarks[index % mockRemarks.length],
      mockCreatedBy: mockAuthors[index % mockAuthors.length]
    }
  })
})

function getReasonColor(reason: string) {
  if (reason === 'Irreparable Damage') return 'negative'
  if (reason === 'EndOfServiceLife') return 'primary'
  if (reason === 'Safety Recall') return 'warning'
  if (reason === 'Upgrade') return 'info'
  return 'grey'
}

const mockTopReasons = [
  { label: 'Beyond Repair', count: 42, value: 0.8, color: 'negative' },
  { label: 'Obsolescence', count: 35, value: 0.65, color: 'primary' },
  { label: 'Safety Failure', count: 18, value: 0.35, color: 'warning' },
  { label: 'Precision Loss', count: 22, value: 0.45, color: 'info' },
  { label: 'Other', count: 7, value: 0.15, color: 'grey' }
]
</script>

<style lang="scss" scoped>
.dashboard-page {
  background-color: #f5f7fb;
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

.font-monospace {
  font-family: 'Courier New', Courier, monospace;
}

.border-blue-2 {
  border: 1px solid #bbdefb;
}

.h-100 {
  height: 100%;
}
</style>
