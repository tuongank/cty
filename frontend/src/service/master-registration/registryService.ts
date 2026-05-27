import { api } from 'boot/axios'
import type { Registry, PaginationState, RegistryResponse } from 'src/objects/master-registration/types'

export const registryService = {
  /**
   * Get registries with pagination and filtering
   * @param {PaginationState & { filter?: string }} params
   * @returns {Promise<RegistryResponse>}
   */
  async getAll(params: PaginationState & { filter?: string }): Promise<RegistryResponse> {
    const res = await api.get('/tool-fh-registries', { params })
    return {
      data: res.data.data,
      total: res.data.meta?._page?.totalElements || 0
    }
  },

  /**
   * Create a new registry entry
   * @param {Partial<Registry>} data
   * @returns {Promise<Registry>}
   */
  async create(data: Partial<Registry>): Promise<Registry> {
    const res = await api.post('/tool-fh-registries', data)
    return res.data.data
  },

  /**
   * Update a registry entry
   * @param {number} id
   * @param {Partial<Registry>} data
   * @returns {Promise<Registry>}
   */
  async update(id: number, data: Partial<Registry>): Promise<Registry> {
    const res = await api.put(`/tool-fh-registries/${id}`, data)
    return res.data.data
  },

  /**
   * Delete a registry entry
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/tool-fh-registries/${id}`)
  },

  /**
   * Download Excel template
   * @returns {Promise<Blob>}
   */
  async downloadTemplate(): Promise<Blob> {
    const res = await api.get('/tool-fh-registries/template/download', { responseType: 'blob' })
    return res.data
  },

  /**
   * Upload Excel data
   * @param {File} file
   * @returns {Promise<any>}
   */
  async uploadExcel(file: File): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/tool-fh-registries/upload/excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data.data
  }
}

