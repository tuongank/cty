<template>
  <q-page class="q-pa-md dashboard-page">
    <div class="row items-center justify-between q-mb-md">
      <div class="page-title">
        <q-breadcrumbs active-color="primary">
          <q-breadcrumbs-el label="Tool Room" icon="home" />
          <q-breadcrumbs-el label="Zone A" />
          <q-breadcrumbs-el label="Dashboard Overview" />
        </q-breadcrumbs>
      </div>
      <q-btn color="primary" icon="add" label="Register New Tool" to="/administration/master-registration" />
    </div>

    <!-- Top KPI Cards -->
    <div class="row q-col-gutter-md q-mb-md">
      <!-- Total Tools -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card">
          <q-card-section class="q-pa-sm">
            <div class="row items-center justify-between text-subtitle2 text-grey-8">
              <span>TOTAL TOOLS</span>
              <q-icon name="inventory_2" color="primary" size="xs" />
            </div>
            <div class="text-h4 text-weight-bold q-mt-sm">{{ store.totalTools.toLocaleString() }}</div>
            <div class="text-caption text-positive q-mt-xs">
              <q-icon name="trending_up" /> +12% vs last month
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tools Online -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card">
          <q-card-section class="q-pa-sm">
            <div class="row items-center justify-between text-subtitle2 text-grey-8">
              <span>TOOLS ONLINE</span>
              <q-icon name="check_circle_outline" color="positive" size="xs" />
            </div>
            <div class="text-h4 text-weight-bold q-mt-sm">{{ store.toolsOnline.toLocaleString() }}</div>
            <div class="q-mt-sm">
              <q-linear-progress :value="onlineRatio" color="positive" size="8px" class="rounded-borders" />
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">{{ (onlineRatio * 100).toFixed(1) }}% Utilization</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tools in PM -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card">
          <q-card-section class="q-pa-sm">
            <div class="row items-center justify-between text-subtitle2 text-grey-8">
              <span>TOOLS IN PM</span>
              <q-icon name="settings" color="warning" size="xs" />
            </div>
            <div class="text-h4 text-weight-bold q-mt-sm">{{ store.toolsPM.toLocaleString() }}</div>
            <div class="text-caption text-warning q-mt-xs text-weight-medium">
              High Load: Scheduled 12
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tools Scrap -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card">
          <q-card-section class="q-pa-sm">
            <div class="row items-center justify-between text-subtitle2 text-grey-8">
              <span>TOOLS SCRAP</span>
              <q-icon name="delete_outline" color="negative" size="xs" />
            </div>
            <div class="text-h4 text-weight-bold q-mt-sm">{{ store.toolsScrap.toLocaleString() }}</div>
            <div class="text-caption text-negative q-mt-xs">
              <q-icon name="trending_down" /> -4% Waste reduction
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Main Dashboard Row -->
    <div class="row q-col-gutter-md q-mb-md">
      <!-- Alert Center -->
      <div class="col-12 col-md-8">
        <q-card class="dashboard-card h-100">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6 row items-center">
              <q-icon name="warning_amber" color="negative" class="q-mr-sm" />
              Alert Center
              <q-badge color="negative" class="q-ml-sm" label="3 CRITICAL" />
            </div>
            <q-btn flat color="primary" label="View All Alerts" size="sm" />
          </q-card-section>
          
          <q-separator />

          <q-table
            flat
            :rows="alerts"
            :columns="alertColumns"
            row-key="id"
            hide-pagination
            :pagination="{ rowsPerPage: 5 }"
          >
            <template v-slot:body-cell-alertLevel="props">
              <q-td :props="props">
                <q-chip
                  :color="props.row.alertLevel === 'CRITICAL' ? 'negative' : 'warning'"
                  text-color="white"
                  size="sm"
                  dense
                  class="text-weight-bold"
                >
                  • {{ props.row.alertLevel }}
                </q-chip>
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="text-right">
                <q-btn
                  outline
                  :color="props.row.alertLevel === 'CRITICAL' ? 'negative' : 'primary'"
                  size="sm"
                  :label="props.row.actionLabel"
                  @click="$q.notify({ message: `Triggered: ${props.row.actionLabel}`, color: 'primary' })"
                />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>

      <!-- Category Distribution Chart -->
      <div class="col-12 col-md-4">
        <q-card class="dashboard-card h-100">
          <q-card-section>
            <div class="text-h6">Category Distribution</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="flex flex-center" style="height: 250px; position: relative;">
            <Doughnut :data="store.categoryDistribution" :options="chartOptions" v-if="!store.loading" />
            <div class="absolute-center text-center" v-if="!store.loading && store.totalTools > 0">
              <div class="text-h5 text-weight-bold">{{ store.totalTools >= 1000 ? (store.totalTools/1000).toFixed(1) + 'k' : store.totalTools }}</div>
              <div class="text-caption text-uppercase text-grey-7" style="font-size: 0.65rem;">Total Tools</div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-list dense>
              <q-item v-for="(count, index) in store.categoryDistribution.datasets[0].data" :key="index">
                <q-item-section avatar>
                  <q-icon name="square" :style="{ color: store.categoryDistribution.datasets[0].backgroundColor[index] }" size="xs" />
                </q-item-section>
                <q-item-section>{{ store.categoryDistribution.labels[index] }}</q-item-section>
                <q-item-section side class="text-weight-bold">
                  {{ count }} units ({{ store.totalTools ? Math.round((count / store.totalTools) * 100) : 0 }}%)
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Maintenance Timeline -->
    <q-card class="dashboard-card">
      <q-card-section class="row justify-between items-center">
        <div class="text-h6">Maintenance Timeline</div>
        <div>
          <q-btn-group outline>
            <q-btn outline color="primary" label="Week" size="sm" />
            <q-btn color="primary" label="Month" size="sm" />
          </q-btn-group>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-md bg-grey-1">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-3" v-for="day in scheduleDays" :key="day.title">
            <q-card flat bordered class="schedule-column h-100">
              <div :class="['schedule-header q-pa-sm text-weight-bold', day.active ? 'bg-primary text-white' : 'bg-grey-3 text-grey-8']">
                {{ day.title }}
                <q-icon name="calendar_today" class="float-right q-mt-xs" />
              </div>
              <div class="q-pa-sm">
                <template v-if="day.events.length">
                  <q-card flat bordered class="q-mb-sm event-card" v-for="(ev, idx) in day.events" :key="idx">
                    <q-card-section class="q-pa-sm">
                      <div class="text-primary text-weight-bold" style="font-size: 0.85rem;">{{ ev.toolId }}</div>
                      <div class="text-caption">{{ ev.desc }}</div>
                      <div class="row justify-between items-center q-mt-sm">
                        <div class="text-grey-6 text-caption">{{ ev.time }}</div>
                        <div :class="['text-caption text-weight-bold', ev.status === 'Confirmed' ? 'text-positive' : 'text-warning']">{{ ev.status }}</div>
                      </div>
                    </q-card-section>
                  </q-card>
                </template>
                <div v-else class="text-center text-grey-5 q-pa-lg">
                  No activities scheduled
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { QTableProps } from 'quasar'
import { useToolManagementStore } from 'src/stores/tool-management/useToolManagementStore'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const store = useToolManagementStore()

onMounted(() => {
  store.fetchAllRegistries()
})

const onlineRatio = computed(() => {
  return store.totalTools === 0 ? 0 : store.toolsOnline / store.totalTools
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: {
      display: false
    }
  }
}

// Mock Alert Data
const alertColumns: QTableProps['columns'] = [
  { name: 'toolId', label: 'TOOL ID', field: 'toolId', align: 'left', style: 'font-weight: 600;' },
  { name: 'condition', label: 'CONDITION', field: 'condition', align: 'left' },
  { name: 'alertLevel', label: 'ALERT LEVEL', field: 'alertLevel', align: 'left' },
  { name: 'remark', label: 'REMARK', field: 'remark', align: 'left', style: 'font-style: italic; color: #666;' },
  { name: 'action', label: 'ACTION', field: 'action', align: 'right' }
]

const alerts = [
  { id: 1, toolId: 'TOOL-001', condition: 'PM due < 7 days', alertLevel: 'WARNING', remark: 'Change color', actionLabel: 'Schedule' },
  { id: 2, toolId: 'TOOL-002', condition: 'PM overdue', alertLevel: 'CRITICAL', remark: 'Block tool', actionLabel: 'Lock Tool' },
  { id: 3, toolId: 'TOOL-003', condition: 'Tool NG', alertLevel: 'CRITICAL', remark: 'Scrap', actionLabel: 'Decommission' },
  { id: 4, toolId: 'TOOL-082', condition: 'Calibration mismatch', alertLevel: 'WARNING', remark: 'Check sensors', actionLabel: 'Inspect' }
]

// Mock Schedule Data
const scheduleDays = [
  {
    title: 'TODAY - OCT 24',
    active: true,
    events: [
      { toolId: 'T-0045 - HEAD', desc: 'Pressure Calibration', time: '09:00 AM', status: 'Confirmed' },
      { toolId: 'T-1122 - FEEDER', desc: 'Lubrication Cycle', time: '02:30 PM', status: 'Pending' }
    ]
  },
  {
    title: 'TOMORROW - OCT 25',
    active: false,
    events: [
      { toolId: 'T-0988 - HEAD', desc: 'Nozzle Replacement', time: '10:00 AM', status: 'Pending' }
    ]
  },
  {
    title: 'MONDAY - OCT 27',
    active: false,
    events: []
  },
  {
    title: 'TUESDAY - OCT 28',
    active: false,
    events: [
      { toolId: 'T-3321 - FEEDER', desc: 'Annual Inspection', time: '08:00 AM', status: 'Pending' }
    ]
  }
]
</script>

<style lang="scss" scoped>
.dashboard-page {
  background-color: #f5f7fb;
}

.kpi-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid #e0e0e0;
}

.dashboard-card {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.h-100 {
  height: 100%;
}

.schedule-column {
  border-radius: 4px;
  background: white;
}

.schedule-header {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  font-size: 0.8rem;
}

.event-card {
  border-left: 3px solid var(--q-primary);
}
</style>
