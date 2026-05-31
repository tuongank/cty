import { api, ApiPagination, ApiFilter } from 'src/packages'
import type { Registry, PaginationState, RegistryResponse } from 'src/objects/tool-feeder'

export const registryService = {
  /**
   * Get registries with pagination and filtering
   * @param {PaginationState & { filter?: string }} params
   * @returns {Promise<RegistryResponse>}
   */
  async getAll(params: PaginationState & { filter?: string }): Promise<RegistryResponse> {
    const apiPagination = new ApiPagination({
      page: params.page,
      rowsPerPage: params.rowsPerPage,
      sortBy: params.sortBy,
      descending: params.descending
    })
    const apiFilter = new ApiFilter(params.filter)

    const data = await api.jsonRequest<Registry[]>('GET', '/tool-fh-registries', null, {
      pagination: apiPagination,
      filter: apiFilter
    })

    return {
      data: data,
      total: apiPagination.rowsNumber
    }
  },

  /**
   * Create a new registry entry
   * @param {Partial<Registry>} data
   * @returns {Promise<Registry>}
   */
  async create(data: Partial<Registry>): Promise<Registry> {
    return api.jsonRequest<Registry>('POST', '/tool-fh-registries', data)
  },

  /**
   * Update a registry entry
   * @param {number} id
   * @param {Partial<Registry>} data
   * @returns {Promise<Registry>}
   */
  async update(id: number, data: Partial<Registry>): Promise<Registry> {
    return api.jsonRequest<Registry>('PUT', `/tool-fh-registries/${id}`, data)
  },

  /**
   * Delete a registry entry
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id: number): Promise<void> {
    await api.jsonRequest<void>('DELETE', `/tool-fh-registries/${id}`)
  },

  /**
   * Download Excel template
   * @returns {Promise<void>}
   */
  async downloadTemplate(): Promise<void> {
    return api.download('GET', '/tool-fh-registries/template/download', null, 'Registry_Template.xlsx')
  },

  /**
   * Upload Excel data
   * @param {File} file
   * @returns {Promise<any>}
   */
  async uploadExcel(file: File): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    return api.formRequest<any>('POST', '/tool-fh-registries/upload/excel', formData)
  }
}

