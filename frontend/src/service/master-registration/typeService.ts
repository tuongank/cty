import { api } from 'boot/axios'
import type { ToolType } from 'src/objects/master-registration/types'

export const typeService = {
  /**
   * Get all types
   * @returns {Promise<ToolType[]>}
   */
  async getAll(): Promise<ToolType[]> {
    const res = await api.get('/types')
    return res.data
  },

  /**
   * Create a new type
   * @param {Partial<ToolType>} data
   * @returns {Promise<ToolType>}
   */
  async create(data: Partial<ToolType>): Promise<ToolType> {
    const res = await api.post('/types', data)
    return res.data
  },

  /**
   * Update a type
   * @param {number} id
   * @param {Partial<ToolType>} data
   * @returns {Promise<ToolType>}
   */
  async update(id: number, data: Partial<ToolType>): Promise<ToolType> {
    const res = await api.put(`/types/${id}`, data)
    return res.data
  },

  /**
   * Delete a type
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/types/${id}`)
  }
}
