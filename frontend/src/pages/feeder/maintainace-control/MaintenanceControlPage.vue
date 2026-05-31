<template>
  <q-page class="q-pa-md dashboard-page">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold text-dark">Maintenance Control</div>
        <div class="text-caption text-grey-7">Asset health monitoring and preventive maintenance schedules.</div>
      </div>
      <div>
        <q-btn color="primary" icon="add" label="LOG MAINTENANCE" />
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="row q-col-gutter-md q-mb-md">
      <!-- Fleet Health Status -->
      <div class="col-12 col-md-5">
        <q-card class="kpi-card h-100" flat bordered>
          <q-card-section>
            <div class="text-subtitle2 text-grey-8 text-uppercase">FLEET HEALTH STATUS</div>
            <div class="row items-center q-mt-sm">
              <div class="text-h3 text-weight-bold text-primary q-mr-sm">88.4%</div>
              <div class="text-subtitle2 text-positive"><q-icon name="trending_up" /> +2.1%</div>
            </div>
            <div class="q-mt-sm">
              <q-linear-progress :value="0.884" color="primary" size="8px" class="rounded-borders" />
            </div>
            <div class="text-caption text-grey-7 q-mt-sm">
              156 Assets Healthy / 18 Actions Required
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Critical Actions -->
      <div class="col-12 col-md-4">
        <q-card class="kpi-card bg-red-1 h-100" flat bordered style="border-color: #ffcdd2;">
          <q-card-section>
            <div class="row justify-between items-center">
              <div class="text-subtitle2 text-negative text-uppercase">CRITICAL ACTIONS</div>
              <q-icon name="warning_amber" color="negative" size="md" style="opacity: 0.5;" />
            </div>
            <div class="text-h3 text-weight-bold text-negative q-mt-sm">04</div>
            <div class="text-caption text-negative q-mt-sm">
              Tools past PM cycle threshold. Immediate validation required.
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Scheduled -->
      <div class="col-12 col-md-3">
        <q-card class="kpi-card bg-blue-grey-1 h-100" flat bordered>
          <q-card-section>
            <div class="text-subtitle2 text-grey-8 text-uppercase">SCHEDULED (NEXT 48H)</div>
            <div class="text-h3 text-weight-bold text-dark q-mt-sm">12</div>
            <div class="row items-center q-mt-sm">
              <q-avatar size="sm" color="grey-4" text-color="dark" class="q-mr-xs text-caption">JD</q-avatar>
              <q-avatar size="sm" color="grey-5" text-color="dark" class="q-mr-xs text-caption">AS</q-avatar>
              <q-avatar size="sm" color="primary" text-color="white" class="q-mr-sm text-caption">+3</q-avatar>
              <span class="text-caption text-italic text-grey-7">Maintenance team assigned</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Main Table -->
    <q-card class="dashboard-card q-mb-md" flat bordered>
      <q-card-section class="row justify-between items-center q-pb-none">
        <div class="text-h6">Maintenance Schedule (TTS_Lifetime)</div>
        <div>
          <q-btn outline icon="filter_list" label="FILTER" size="sm" class="q-mr-sm" />
          <q-btn outline icon="download" label="EXPORT" size="sm" />
        </div>
      </q-card-section>

      <q-table
        flat
        :rows="enrichedMaintenanceList"
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

        <template v-slot:body-cell-toolId="props">
          <q-td :props="props" class="text-primary text-weight-bold">
            {{ props.row.serialNumber }}
          </q-td>
        </template>

        <template v-slot:body-cell-usage="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-linear-progress :value="props.row.mockUsageRatio" :color="props.row.mockUsageColor" size="4px" class="col q-mr-sm" />
              <span class="text-caption">{{ props.row.mockUsageVal.toLocaleString() }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-nextPm="props">
          <q-td :props="props" :class="props.row.mockNextPm === 'OVERDUE' ? 'text-negative text-weight-bold' : ''">
            {{ props.row.mockNextPm }}
          </q-td>
        </template>

        <template v-slot:body-cell-priority="props">
          <q-td :props="props">
            <q-chip
              :color="getPriorityColor(props.row.mockPriority)"
              text-color="white"
              size="sm"
              dense
              class="text-weight-bold q-px-sm"
            >
              • {{ props.row.mockPriority }}
            </q-chip>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <div class="row q-col-gutter-md">
      <!-- Validation History -->
      <div class="col-12 col-md-8">
        <q-card class="dashboard-card h-100" flat bordered>
          <q-card-section class="row justify-between items-center q-pb-none">
            <div class="text-h6">Validation History</div>
            <div class="text-caption text-grey-7">Last 30 Days</div>
          </q-card-section>
          
          <q-list separator class="q-mt-md">
            <q-item class="q-py-md">
              <q-item-section avatar>
                <q-icon name="verified" color="positive" size="lg" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">T-2041-XP Validation</q-item-label>
                <q-item-label caption>Tolerance check: +/- 0.002mm</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-positive text-weight-bold">OK</q-item-label>
                <q-item-label caption>Today, 09:12 AM</q-item-label>
              </q-item-section>
            </q-item>
            
            <q-item class="q-py-md bg-red-1">
              <q-item-section avatar>
                <q-icon name="warning" color="negative" size="lg" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">T-0982-HP Alignment</q-item-label>
                <q-item-label caption class="text-negative">Remark: Lateral drift detected on Axis B.</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-negative text-weight-bold">NG</q-item-label>
                <q-item-label caption>Yesterday, 04:45 PM</q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="q-py-md">
              <q-item-section avatar>
                <q-icon name="verified" color="positive" size="lg" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">T-1150-MD Post-Repair</q-item-label>
                <q-item-label caption>Remark: Full recalibration successful.</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-positive text-weight-bold">OK</q-item-label>
                <q-item-label caption>May 14, 2024</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card-actions align="center">
            <q-btn flat color="primary" label="VIEW FULL AUDIT LOG" class="text-weight-bold" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Right Column -->
      <div class="col-12 col-md-4">
        <!-- Timeline -->
        <q-card class="dashboard-card q-mb-md" flat bordered>
          <q-card-section>
            <div class="text-subtitle2 text-grey-8 text-uppercase q-mb-md">MAINTENANCE TIMELINE</div>
            
            <q-timeline color="primary" class="q-pl-sm">
              <q-timeline-entry
                title="Scheduled Down-time"
                subtitle="Tomorrow, 08:00"
                color="primary"
                icon="build"
              >
                <div class="text-caption">Cell 04 Tool Swap</div>
              </q-timeline-entry>

              <q-timeline-entry
                title="Quarterly Calibration"
                subtitle="May 25, 2024"
                color="grey-4"
                icon="science"
              >
                <div class="text-caption">External Audit Team</div>
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>
        </q-card>

        <!-- Breadcrumb Box -->
        <q-card class="dashboard-card bg-dark text-white" flat bordered>
          <q-card-section>
            <div class="text-subtitle2 text-grey-5 text-uppercase q-mb-sm">LOCATION BREADCRUMB</div>
            <div class="row items-center text-subtitle1">
              <q-icon name="account_tree" class="q-mr-sm" size="sm" />
              <span>Tool Room</span>
              <q-icon name="chevron_right" class="q-mx-xs" />
              <span>Zone B</span>
              <q-icon name="chevron_right" class="q-mx-xs" />
              <span class="text-weight-bold">Bin 402</span>
            </div>
            <q-icon name="place" size="80px" color="white" style="position: absolute; right: 10px; bottom: 10px; opacity: 0.1;" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { QTableProps } from 'quasar'
import { useMasterRegistrationStore } from 'src/stores/useMasterRegistrationStore'

const store = useMasterRegistrationStore()

const pagination = ref({
  page: 1,
  rowsPerPage: 5
})

onMounted(() => {
  store.fetchAllRegistries()
})

const columns: QTableProps['columns'] = [
  { name: 'toolId', label: 'TOOL ID', field: 'serialNumber', align: 'left' },
  { name: 'cycle', label: 'CHECK CYCLE', field: 'mockCycle', align: 'left' },
  { name: 'usage', label: 'CURRENT USAGE', field: 'mockUsage', align: 'left', style: 'width: 250px;' },
  { name: 'lastPm', label: 'LAST PM TIME', field: 'mockLastPm', align: 'left' },
  { name: 'nextPm', label: 'NEXT PM FORECAST', field: 'mockNextPm', align: 'left' },
  { name: 'priority', label: 'PRIORITY', field: 'mockPriority', align: 'center' }
]

// Mock logic for fields we don't have
const mockCycles = ['500,000 Shots', '2,000 Hours', '150,000 Cycles']
const mockUsageVals = [502441, 1842, 67500]
const mockUsageRatios = [1.0, 0.92, 0.45]
const mockUsageColors = ['negative', 'warning', 'primary']
const mockLastPms = ['2023-10-12', '2023-11-05', '2024-02-28']
const mockNextPms = ['OVERDUE', '2024-05-20', '2024-09-15']
const mockPriorities = ['CRITICAL', 'UPCOMING', 'STABLE']

const enrichedMaintenanceList = computed(() => {
  return store.allRegistries.map((item, index) => {
    return {
      ...item,
      mockCycle: mockCycles[index % 3],
      mockUsageVal: mockUsageVals[index % 3],
      mockUsageRatio: mockUsageRatios[index % 3],
      mockUsageColor: mockUsageColors[index % 3],
      mockLastPm: mockLastPms[index % 3],
      mockNextPm: mockNextPms[index % 3],
      mockPriority: mockPriorities[index % 3]
    }
  })
})

function getPriorityColor(p: string) {
  if (p === 'CRITICAL') return 'negative'
  if (p === 'UPCOMING') return 'warning'
  if (p === 'STABLE') return 'positive'
  return 'grey'
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  background-color: #f5f7fb;
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
