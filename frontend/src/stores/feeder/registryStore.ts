import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { registryService } from 'src/service/tool-feeder/registryService'
import type { Registry, PaginationState } from 'src/objects/tool-feeder'

export const useRegistryStore = defineStore('registry', () => {
  const registries = ref<Registry[]>([])
  const allRegistries = ref<Registry[]>([])
  const registriesLoading = ref(false)
  const registryTotal = ref(0)

  const registryPagination = ref<PaginationState>({
    page: 1,
    rowsPerPage: 5,
    rowsNumber: 0,
    sortBy: null,
    descending: false
  })
  const registryFilter = ref('')

  const scrapList = computed(() =>
    allRegistries.value.filter(r => r.status.toUpperCase().includes('SCRAP'))
  )

  async function fetchAllRegistries() {
    registriesLoading.value = true
    try {
      const result = await registryService.getAll({
        page: 1,
        rowsPerPage: 10000,
        filter: '',
        sortBy: null,
        descending: false
      })
      allRegistries.value = result.data
    } catch (error) {
      console.error('Failed to fetch all registries:', error)
      throw error
    } finally {
      registriesLoading.value = false
    }
  }

  async function fetchRegistries(props?: { pagination?: PaginationState; filter?: string }) {
    registriesLoading.value = true
    try {
      const { page, rowsPerPage, sortBy, descending } = props?.pagination || registryPagination.value
      const filter = props?.filter !== undefined ? props.filter : registryFilter.value

      const result = await registryService.getAll({
        page,
        rowsPerPage,
        filter,
        sortBy,
        descending
      })

      registries.value = result.data
      registryTotal.value = result.total
      registryPagination.value = {
        page,
        rowsPerPage,
        rowsNumber: result.total,
        sortBy,
        descending
      }

      if (filter !== undefined) {
        registryFilter.value = filter
      }
    } catch (error) {
      console.error('Failed to fetch registries:', error)
      throw error
    } finally {
      registriesLoading.value = false
    }
  }

  async function createRegistry(data: Partial<Registry>) {
    try {
      const result = await registryService.create(data)
      await fetchRegistries()
      return result
    } catch (error) {
      console.error('Failed to create registry:', error)
      throw error
    }
  }

  async function updateRegistry(id: number, data: Partial<Registry>) {
    try {
      const result = await registryService.update(id, data)
      await fetchRegistries()
      return result
    } catch (error) {
      console.error('Failed to update registry:', error)
      throw error
    }
  }

  async function deleteRegistry(id: number) {
    try {
      await registryService.delete(id)
      await fetchRegistries()
    } catch (error) {
      console.error('Failed to delete registry:', error)
      throw error
    }
  }

  async function downloadTemplate() {
    try {
      return await registryService.downloadTemplate()
    } catch (error) {
      console.error('Failed to download template:', error)
      throw error
    }
  }

  async function uploadExcel(file: File) {
    try {
      const result = await registryService.uploadExcel(file)
      await fetchRegistries()
      return result
    } catch (error) {
      console.error('Failed to upload Excel:', error)
      throw error
    }
  }

  return {
    registries,
    allRegistries,
    registriesLoading,
    registryTotal,
    registryPagination,
    registryFilter,
    scrapList,
    fetchAllRegistries,
    fetchRegistries,
    createRegistry,
    updateRegistry,
    deleteRegistry,
    downloadTemplate,
    uploadExcel
  }
})
