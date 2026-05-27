import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { categoryService } from 'src/service/master-registration/categoryService'
import { typeService } from 'src/service/master-registration/typeService'
import { registryService } from 'src/service/master-registration/registryService'
import type { Category, ToolType, Registry, PaginationState } from 'src/objects/master-registration/types'

export const useMasterRegistrationStore = defineStore('masterRegistration', () => {
  // ============================================
  // State
  // ============================================

  // Categories
  const categories = ref<Category[]>([])
  const categoriesLoading = ref(false)

  // Types
  const types = ref<ToolType[]>([])
  const typesLoading = ref(false)

  // Registries
  const registries = ref<Registry[]>([])
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

  // ============================================
  // Getters
  // ============================================
  const categoryOptions = computed(() =>
    categories.value.map(c => ({
      label: c.name,
      value: c.id
    }))
  )

  const getTypesByCategory = computed(() => {
    return (categoryId: string) =>
      types.value.filter(t => t.categoryId === categoryId)
  })

  // ============================================
  // Category Actions
  // ============================================
  async function fetchCategories() {
    categoriesLoading.value = true
    try {
      categories.value = await categoryService.getAll()
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    } finally {
      categoriesLoading.value = false
    }
  }

  async function createCategory(data: Partial<Category>) {
    categoriesLoading.value = true
    try {
      const result = await categoryService.create(data)
      categories.value.push(result)
      return result
    } catch (error) {
      console.error('Failed to create category:', error)
      throw error
    } finally {
      categoriesLoading.value = false
    }
  }

  async function updateCategory(id: string, data: Partial<Category>) {
    categoriesLoading.value = true
    try {
      const result = await categoryService.update(id, data)
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) categories.value[index] = result
      return result
    } catch (error) {
      console.error('Failed to update category:', error)
      throw error
    } finally {
      categoriesLoading.value = false
    }
  }

  async function deleteCategory(id: string) {
    categoriesLoading.value = true
    try {
      await categoryService.delete(id)
      categories.value = categories.value.filter(c => c.id !== id)
    } catch (error) {
      console.error('Failed to delete category:', error)
      throw error
    } finally {
      categoriesLoading.value = false
    }
  }

  // ============================================
  // Type Actions
  // ============================================
  async function fetchTypes() {
    typesLoading.value = true
    try {
      types.value = await typeService.getAll()
    } catch (error) {
      console.error('Failed to fetch types:', error)
      throw error
    } finally {
      typesLoading.value = false
    }
  }

  async function createType(data: Partial<ToolType>) {
    typesLoading.value = true
    try {
      const result = await typeService.create(data)
      types.value.push(result)
      return result
    } catch (error) {
      console.error('Failed to create type:', error)
      throw error
    } finally {
      typesLoading.value = false
    }
  }

  async function updateType(id: number, data: Partial<ToolType>) {
    typesLoading.value = true
    try {
      const result = await typeService.update(id, data)
      const index = types.value.findIndex(t => t.id === id)
      if (index !== -1) types.value[index] = result
      return result
    } catch (error) {
      console.error('Failed to update type:', error)
      throw error
    } finally {
      typesLoading.value = false
    }
  }

  async function deleteType(id: number) {
    typesLoading.value = true
    try {
      await typeService.delete(id)
      types.value = types.value.filter(t => t.id !== id)
    } catch (error) {
      console.error('Failed to delete type:', error)
      throw error
    } finally {
      typesLoading.value = false
    }
  }

  // ============================================
  // Registry Actions
  // ============================================
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

  // ============================================
  // Init
  // ============================================
  async function initializeData() {
    await Promise.all([
      fetchCategories(),
      fetchTypes(),
      fetchRegistries()
    ])
  }

  return {
    // State
    categories,
    categoriesLoading,
    types,
    typesLoading,
    registries,
    registriesLoading,
    registryTotal,
    registryPagination,
    registryFilter,

    // Getters
    categoryOptions,
    getTypesByCategory,

    // Category Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,

    // Type Actions
    fetchTypes,
    createType,
    updateType,
    deleteType,

    // Registry Actions
    fetchRegistries,
    createRegistry,
    updateRegistry,
    deleteRegistry,
    downloadTemplate,
    uploadExcel,

    // Init
    initializeData
  }
})
