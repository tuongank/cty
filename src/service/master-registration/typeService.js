import { api } from 'boot/axios'
import { ENDPOINTS } from 'src/config/api.config'

// ============================================
// MOCK DATA - Remove when connecting to real API
// ============================================
let mockTypes = [
  { id: 1, categoryId: 'CAT-001', categoryName: 'FEEDER', typeCode: '08MM' },
  { id: 2, categoryId: 'CAT-001', categoryName: 'FEEDER', typeCode: '04MM' },
  { id: 3, categoryId: 'CAT-002', categoryName: 'HEAD', typeCode: 'MULTI-S' }
]
let nextTypeId = 4

function delay (ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
// ============================================

export const typeService = {
  /**
   * Get all types
   * @returns {Promise<Array>}
   */
  async getAll () {
    // TODO: Replace with real API call
    // return api.get(ENDPOINTS.TYPES).then(res => res.data)
    await delay()
    return [...mockTypes]
  },

  /**
   * Create a new type
   * @param {Object} data - { categoryId, categoryName, typeCode }
   * @returns {Promise<Object>}
   */
  async create (data) {
    // TODO: Replace with real API call
    // return api.post(ENDPOINTS.TYPES, data).then(res => res.data)
    await delay()
    const newType = {
      id: nextTypeId++,
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      typeCode: data.typeCode.toUpperCase()
    }
    mockTypes.push(newType)
    return { ...newType }
  },

  /**
   * Update a type
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update (id, data) {
    // TODO: Replace with real API call
    // return api.put(ENDPOINTS.TYPE_BY_ID(id), data).then(res => res.data)
    await delay()
    const index = mockTypes.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Type not found')
    mockTypes[index] = {
      ...mockTypes[index],
      categoryId: data.categoryId || mockTypes[index].categoryId,
      categoryName: data.categoryName || mockTypes[index].categoryName,
      typeCode: data.typeCode ? data.typeCode.toUpperCase() : mockTypes[index].typeCode
    }
    return { ...mockTypes[index] }
  },

  /**
   * Delete a type
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete (id) {
    // TODO: Replace with real API call
    // return api.delete(ENDPOINTS.TYPE_BY_ID(id)).then(res => res.data)
    await delay()
    mockTypes = mockTypes.filter(t => t.id !== id)
  }
}
