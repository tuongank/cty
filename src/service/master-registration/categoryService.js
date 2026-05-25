import { api } from 'boot/axios'
import { ENDPOINTS } from 'src/config/api.config'

// ============================================
// MOCK DATA - Remove when connecting to real API
// ============================================
let mockCategories = [
  { id: 'CAT-001', name: 'FEEDER' },
  { id: 'CAT-002', name: 'HEAD' }
]
let nextCatId = 3

function generateCatId () {
  const id = `CAT-${String(nextCatId).padStart(3, '0')}`
  nextCatId++
  return id
}

// Simulate API delay
function delay (ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
// ============================================

export const categoryService = {
  /**
   * Get all categories
   * @returns {Promise<Array>}
   */
  async getAll () {
    // TODO: Replace with real API call
    // return api.get(ENDPOINTS.CATEGORIES).then(res => res.data)
    await delay()
    return [...mockCategories]
  },

  /**
   * Create a new category
   * @param {Object} data - { name: string }
   * @returns {Promise<Object>}
   */
  async create (data) {
    // TODO: Replace with real API call
    // return api.post(ENDPOINTS.CATEGORIES, data).then(res => res.data)
    await delay()
    const newCategory = {
      id: generateCatId(),
      name: data.name.toUpperCase()
    }
    mockCategories.push(newCategory)
    return { ...newCategory }
  },

  /**
   * Update a category
   * @param {string} id
   * @param {Object} data - { name: string }
   * @returns {Promise<Object>}
   */
  async update (id, data) {
    // TODO: Replace with real API call
    // return api.put(ENDPOINTS.CATEGORY_BY_ID(id), data).then(res => res.data)
    await delay()
    const index = mockCategories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Category not found')
    mockCategories[index] = { ...mockCategories[index], name: data.name.toUpperCase() }
    return { ...mockCategories[index] }
  },

  /**
   * Delete a category
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete (id) {
    // TODO: Replace with real API call
    // return api.delete(ENDPOINTS.CATEGORY_BY_ID(id)).then(res => res.data)
    await delay()
    mockCategories = mockCategories.filter(c => c.id !== id)
  }
}
