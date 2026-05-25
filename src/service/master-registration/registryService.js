import { api } from 'boot/axios'
import { ENDPOINTS } from 'src/config/api.config'

// ============================================
// MOCK DATA - Remove when connecting to real API
// ============================================
const generateMockRegistries = () => {
  const categories = ['FEEDER', 'HEAD']
  const types = {
    FEEDER: ['08MM', '04MM'],
    HEAD: ['MULTI-S']
  }
  const statuses = ['ACTIVE', 'MAINT', 'STORAGE', 'REPAIR']
  const zones = ['A1-B04', 'C2-C11', 'A1-B05', 'D3-A02', 'B1-C07']
  const lines = ['LINE-01', 'LINE-02', 'LINE-03', 'LINE-04', 'LINE-05']
  const registries = []

  for (let i = 1; i <= 124; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)]
    const typeList = types[cat]
    const type = typeList[Math.floor(Math.random() * typeList.length)]
    const prefix = cat === 'FEEDER' ? 'F' : 'H'
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const isHead = cat === 'HEAD'
    const zone = isHead ? lines[Math.floor(Math.random() * lines.length)] : zones[Math.floor(Math.random() * zones.length)]

    registries.push({
      id: i,
      serialNumber: `${prefix}-${type.replace('-', '')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      categoryId: cat === 'FEEDER' ? 'CAT-001' : 'CAT-002',
      categoryName: cat,
      typeCode: type,
      zoneLoc: zone,
      status: status
    })
  }
  return registries
}

let mockRegistries = generateMockRegistries()
let nextRegId = 125

function delay (ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
// ============================================

export const registryService = {
  /**
   * Get registries with pagination and filtering
   * @param {Object} params - { page, rowsPerPage, filter, sortBy, descending }
   * @returns {Promise<{ data: Array, total: number }>}
   */
  async getAll (params = {}) {
    // TODO: Replace with real API call
    // return api.get(ENDPOINTS.REGISTRIES, { params }).then(res => res.data)
    await delay()
    const { page = 1, rowsPerPage = 5, filter = '', sortBy, descending } = params

    let filtered = [...mockRegistries]

    // Filter by serial number
    if (filter) {
      const lowerFilter = filter.toLowerCase()
      filtered = filtered.filter(r =>
        r.serialNumber.toLowerCase().includes(lowerFilter)
      )
    }

    // Sort
    if (sortBy) {
      filtered.sort((a, b) => {
        const valA = a[sortBy] || ''
        const valB = b[sortBy] || ''
        const compare = String(valA).localeCompare(String(valB))
        return descending ? -compare : compare
      })
    }

    const total = filtered.length
    const start = (page - 1) * rowsPerPage
    const data = rowsPerPage > 0 ? filtered.slice(start, start + rowsPerPage) : filtered

    return { data, total }
  },

  /**
   * Create a new registry entry
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create (data) {
    // TODO: Replace with real API call
    // return api.post(ENDPOINTS.REGISTRIES, data).then(res => res.data)
    await delay()
    const newRegistry = {
      id: nextRegId++,
      ...data
    }
    mockRegistries.unshift(newRegistry)
    return { ...newRegistry }
  },

  /**
   * Update a registry entry
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update (id, data) {
    // TODO: Replace with real API call
    // return api.put(ENDPOINTS.REGISTRY_BY_ID(id), data).then(res => res.data)
    await delay()
    const index = mockRegistries.findIndex(r => r.id === id)
    if (index === -1) throw new Error('Registry not found')
    mockRegistries[index] = { ...mockRegistries[index], ...data }
    return { ...mockRegistries[index] }
  },

  /**
   * Delete a registry entry
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete (id) {
    // TODO: Replace with real API call
    // return api.delete(ENDPOINTS.REGISTRY_BY_ID(id)).then(res => res.data)
    await delay()
    mockRegistries = mockRegistries.filter(r => r.id !== id)
  },

  /**
   * Download Excel template
   * @returns {Promise<Blob>}
   */
  async downloadTemplate () {
    // TODO: Replace with real API call
    // return api.get(ENDPOINTS.DOWNLOAD_TEMPLATE, { responseType: 'blob' }).then(res => res.data)
    await delay()
    console.log('[Mock] Download template triggered')
    return null
  },

  /**
   * Upload Excel data
   * @param {File} file
   * @returns {Promise<Object>}
   */
  async uploadExcel (file) {
    // TODO: Replace with real API call
    // const formData = new FormData()
    // formData.append('file', file)
    // return api.post(ENDPOINTS.UPLOAD_EXCEL, formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // }).then(res => res.data)
    await delay(500)
    console.log('[Mock] Upload Excel triggered', file?.name)
    return { imported: 0, message: 'Mock upload - connect to real API' }
  }
}
