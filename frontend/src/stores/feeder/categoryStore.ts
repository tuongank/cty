import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { categoryService } from 'src/service/tool-feeder/categoryService'
import type { Category } from 'src/objects/tool-feeder'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const categoriesLoading = ref(false)

  const categoryOptions = computed(() =>
    categories.value.map(c => ({
      label: c.category,
      value: c.id
    }))
  )

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

  async function updateCategory(id: number, data: Partial<Category>) {
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

  async function deleteCategory(id: number) {
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

  return {
    categories,
    categoriesLoading,
    categoryOptions,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
