import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { typeService } from 'src/service/tool-feeder/typeService'
import type { ToolType } from 'src/objects/tool-feeder'

export const useTypeStore = defineStore('type', () => {
  const types = ref<ToolType[]>([])
  const typesLoading = ref(false)

  const getTypesByCategory = computed(() => {
    return (categoryId: number) =>
      types.value.filter(t => t.categoryId === categoryId)
  })

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

  return {
    types,
    typesLoading,
    getTypesByCategory,
    fetchTypes,
    createType,
    updateType,
    deleteType
  }
})
