import { api } from 'src/packages'
import type { ToolType } from 'src/objects/tool-feeder'

export const typeService = {
  /**
   * Get all types
   * @returns {Promise<ToolType[]>}
   */
  async getAll(): Promise<ToolType[]> {
    return api.jsonRequest<ToolType[]>('GET', '/tool-fh-types')
  },

  /**
   * Create a new type
   * @param {Partial<ToolType>} data
   * @returns {Promise<ToolType>}
   */
  async create(data: Partial<ToolType>): Promise<ToolType> {
    return api.jsonRequest<ToolType>('POST', '/tool-fh-types', data)
  },

  /**
   * Update a type
   * @param {number} id
   * @param {Partial<ToolType>} data
   * @returns {Promise<ToolType>}
   */
  async update(id: number, data: Partial<ToolType>): Promise<ToolType> {
    return api.jsonRequest<ToolType>('PUT', `/tool-fh-types/${id}`, data)
  },

  /**
   * Delete a type
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id: number): Promise<void> {
    await api.jsonRequest<void>('DELETE', `/tool-fh-types/${id}`)
  }
}

