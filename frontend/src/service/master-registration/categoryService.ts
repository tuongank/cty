import { api } from 'boot/axios'
import type { Category } from 'src/objects/master-registration/types'

export const categoryService = {
  /**
   * Get all categories
   * @returns {Promise<Category[]>}
   */
  async getAll(): Promise<Category[]> {
    const res = await api.get('/tool-feeder')
    return res.data.data
  },

  /**
   * Create a new category
   * @param {Partial<Category>} data
   * @returns {Promise<Category>}
   */
  async create(data: Partial<Category>): Promise<Category> {
    const res = await api.post('/tool-feeder', { categoryName: data.category })
    return res.data.data
  },

  /**
   * Update a category
   * @param {number} id
   * @param {Partial<Category>} data
   * @returns {Promise<Category>}
   */
  async update(id: number, data: Partial<Category>): Promise<Category> {
    const res = await api.put(`/tool-feeder/${id}`, { categoryName: data.category })
    return res.data.data
  },

  /**
   * Delete a category
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/tool-feeder/${id}`)
  }
}

