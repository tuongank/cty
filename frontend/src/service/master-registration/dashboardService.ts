import { api } from 'boot/axios'

export interface DashboardMetrics {
  totalTools: number
  toolsOnline: number
  toolsPM: number
  toolsScrap: number
  toolsRepair: number
  categoryDistribution: Record<string, number>
}

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await api.get('/api/dashboard/metrics')
    return response.data
  }
}
