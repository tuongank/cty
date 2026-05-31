import { api } from 'src/packages'
import type { Category } from 'src/objects/tool-feeder'

export const categoryService = {
  /**
   * Get all categories
   * @returns {Promise<Category[]>}
   */
  async getAll(): Promise<Category[]> {
    return api.jsonRequest<Category[]>('GET', '/tool-feeder')
  },

  /**
   * Create a new category
   * @param {Partial<Category>} data
   * @returns {Promise<Category>}
   */
  async create(data: Partial<Category>): Promise<Category> {
    return api.jsonRequest<Category>('POST', '/tool-feeder', { categoryName: data.category })
  },

  /**
   * Update a category
   * @param {number} id
   * @param {Partial<Category>} data
   * @returns {Promise<Category>}
   */
  async update(id: number, data: Partial<Category>): Promise<Category> {
    return api.jsonRequest<Category>('PUT', `/tool-feeder/${id}`, { categoryName: data.category })
  },

  /**
   * Delete a category
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id: number): Promise<void> {
    await api.jsonRequest<void>('DELETE', `/tool-feeder/${id}`)
  }
}

