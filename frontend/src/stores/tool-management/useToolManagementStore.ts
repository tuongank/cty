import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { registryService } from 'src/service/master-registration/registryService'
import type { Registry } from 'src/objects/master-registration/types'

export const useToolManagementStore = defineStore('toolManagement', () => {
  const allRegistries = ref<Registry[]>([])
  const loading = ref(false)

  // Fetch all registries for dashboard metrics
  async function fetchAllRegistries() {
    loading.value = true
    try {
      // Assuming a max of 10000 records for the dashboard metrics
      const result = await registryService.getAll({
        page: 1,
        rowsPerPage: 10000,
        rowsNumber: 0,
        sortBy: null,
        descending: false
      })
      allRegistries.value = result.data
    } catch (error) {
      console.error('Failed to fetch registries for dashboard', error)
    } finally {
      loading.value = false
    }
  }

  // Dashboard computed properties
  const totalTools = computed(() => allRegistries.value.length)
  
  const toolsOnline = computed(() => 
    allRegistries.value.filter(r => r.status.toUpperCase() === 'ACTIVE' || r.status.toUpperCase() === 'ONLINE').length
  )
  
  const toolsScrap = computed(() => 
    allRegistries.value.filter(r => r.status.toUpperCase() === 'SCRAP').length
  )

  const toolsPM = computed(() => 
    allRegistries.value.filter(r => r.status.toUpperCase() === 'PM' || r.status.toUpperCase() === 'MAINTENANCE').length
  )

  const toolsRepair = computed(() => 
    allRegistries.value.filter(r => r.status.toUpperCase() === 'REPAIR').length
  )

  // Doughnut Chart data (Category Distribution)
  const categoryDistribution = computed(() => {
    const dist = allRegistries.value.reduce((acc, curr) => {
      acc[curr.categoryName] = (acc[curr.categoryName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

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

  // Scrap History filtered
  const scrapList = computed(() => 
    allRegistries.value.filter(r => r.status.toUpperCase() === 'SCRAP')
  )

  return {
    allRegistries,
    loading,
    fetchAllRegistries,
    totalTools,
    toolsOnline,
    toolsScrap,
    toolsPM,
    toolsRepair,
    categoryDistribution,
    scrapList
  }
})
