import { api } from 'boot/axios'
import type { Category } from 'src/objects/master-registration/types'

export const categoryService = {
  /**
   * Get all categories
   * @returns {Promise<Category[]>}
   */
  async getAll(): Promise<Category[]> {
    const res = await api.get('/categories')
    return res.data
  },

  /**
   * Create a new category
   * @param {Partial<Category>} data
   * @returns {Promise<Category>}
   */
  async create(data: Partial<Category>): Promise<Category> {
    const res = await api.post('/categories', data)
    return res.data
  },

  /**
   * Update a category
   * @param {string} id
   * @param {Partial<Category>} data
   * @returns {Promise<Category>}
   */
  async update(id: string, data: Partial<Category>): Promise<Category> {
    const res = await api.put(`/categories/${id}`, data)
    return res.data
  },

  /**
   * Delete a category
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`)
  }
}
