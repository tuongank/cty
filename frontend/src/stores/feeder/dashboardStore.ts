import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dashboardService, type DashboardMetrics } from 'src/service/tool-feeder/dashboardService'

export const useDashboardStore = defineStore('dashboard', () => {
  const dashboardMetrics = ref<DashboardMetrics | null>(null)
  const dashboardLoading = ref(false)

  const totalTools = computed(() => dashboardMetrics.value?.totalTools || 0)
  const toolsOnline = computed(() => dashboardMetrics.value?.toolsOnline || 0)
  const toolsScrap = computed(() => dashboardMetrics.value?.toolsScrap || 0)
  const toolsPM = computed(() => dashboardMetrics.value?.toolsPM || 0)
  const toolsRepair = computed(() => dashboardMetrics.value?.toolsRepair || 0)

  const categoryDistribution = computed(() => {
    if (!dashboardMetrics.value || !dashboardMetrics.value.categoryDistribution) {
      return { labels: [], datasets: [ { data: [], backgroundColor: [] } ] }
    }
    const dist = dashboardMetrics.value.categoryDistribution
    return {
      labels: Object.keys(dist),
      datasets: [
        {
          data: Object.values(dist),
          backgroundColor: ['#1976D2', '#21BA45', '#F2C037', '#C10015', '#9C27B0'],
          borderWidth: 0
        }
      ]
    }
  })

  async function fetchMetrics() {
    dashboardLoading.value = true
    try {
      dashboardMetrics.value = await dashboardService.getMetrics()
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error)
      throw error
    } finally {
      dashboardLoading.value = false
    }
  }

  return {
    dashboardMetrics,
    dashboardLoading,
    totalTools,
    toolsOnline,
    toolsScrap,
    toolsPM,
    toolsRepair,
    categoryDistribution,
    fetchMetrics
  }
})
