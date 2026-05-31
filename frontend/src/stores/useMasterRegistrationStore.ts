import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useCategoryStore } from './feeder/categoryStore'
import { useTypeStore } from './feeder/typeStore'
import { useRegistryStore } from './feeder/registryStore'
import { useDashboardStore } from './feeder/dashboardStore'

export const useMasterRegistrationStore = defineStore('masterRegistration', () => {
  const categoryStore = useCategoryStore()
  const typeStore = useTypeStore()
  const registryStore = useRegistryStore()
  const dashboardStore = useDashboardStore()

  // Categories
  const categories = computed({
    get: () => categoryStore.categories,
    set: (val) => { categoryStore.categories = val }
  })
  const categoriesLoading = computed(() => categoryStore.categoriesLoading)
  const categoryOptions = computed(() => categoryStore.categoryOptions)

  // Types
  const types = computed({
    get: () => typeStore.types,
    set: (val) => { typeStore.types = val }
  })
  const typesLoading = computed(() => typeStore.typesLoading)
  const getTypesByCategory = computed(() => typeStore.getTypesByCategory)

  // Registries
  const registries = computed({
    get: () => registryStore.registries,
    set: (val) => { registryStore.registries = val }
  })
  const allRegistries = computed({
    get: () => registryStore.allRegistries,
    set: (val) => { registryStore.allRegistries = val }
  })
  const registriesLoading = computed(() => registryStore.registriesLoading)
  const registryTotal = computed(() => registryStore.registryTotal)
  const registryPagination = computed(() => registryStore.registryPagination)
  const registryFilter = computed(() => registryStore.registryFilter)
  const scrapList = computed(() => registryStore.scrapList)

  // Dashboard
  const dashboardMetrics = computed(() => dashboardStore.dashboardMetrics)
  const totalTools = computed(() => dashboardStore.totalTools)
  const toolsOnline = computed(() => dashboardStore.toolsOnline)
  const toolsScrap = computed(() => dashboardStore.toolsScrap)
  const toolsPM = computed(() => dashboardStore.toolsPM)
  const toolsRepair = computed(() => dashboardStore.toolsRepair)
  const categoryDistribution = computed(() => dashboardStore.categoryDistribution)

  // Actions
  const fetchCategories = () => categoryStore.fetchCategories()
  const createCategory = (data: any) => categoryStore.createCategory(data)
  const updateCategory = (id: number, data: any) => categoryStore.updateCategory(id, data)
  const deleteCategory = (id: number) => categoryStore.deleteCategory(id)

  const fetchTypes = () => typeStore.fetchTypes()
  const createType = (data: any) => typeStore.createType(data)
  const updateType = (id: number, data: any) => typeStore.updateType(id, data)
  const deleteType = (id: number) => typeStore.deleteType(id)

  const fetchAllRegistries = async () => {
    registryStore.registriesLoading = true
    try {
      await Promise.all([
        dashboardStore.fetchMetrics(),
        registryStore.fetchAllRegistries()
      ])
    } finally {
      registryStore.registriesLoading = false
    }
  }

  const fetchRegistries = (props?: any) => registryStore.fetchRegistries(props)
  const createRegistry = (data: any) => registryStore.createRegistry(data)
  const updateRegistry = (id: number, data: any) => registryStore.updateRegistry(id, data)
  const deleteRegistry = (id: number) => registryStore.deleteRegistry(id)
  const downloadTemplate = () => registryStore.downloadTemplate()
  const uploadExcel = (file: File) => registryStore.uploadExcel(file)

  const initializeData = async () => {
    await Promise.all([
      categoryStore.fetchCategories(),
      typeStore.fetchTypes(),
      registryStore.fetchRegistries()
    ])
  }

  return {
    categories,
    categoriesLoading,
    categoryOptions,
    types,
    typesLoading,
    getTypesByCategory,
    registries,
    allRegistries,
    registriesLoading,
    registryTotal,
    registryPagination,
    registryFilter,
    scrapList,
    dashboardMetrics,
    totalTools,
    toolsOnline,
    toolsScrap,
    toolsPM,
    toolsRepair,
    categoryDistribution,

    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchTypes,
    createType,
    updateType,
    deleteType,
    fetchAllRegistries,
    fetchRegistries,
    createRegistry,
    updateRegistry,
    deleteRegistry,
    downloadTemplate,
    uploadExcel,
    initializeData
  }
})
