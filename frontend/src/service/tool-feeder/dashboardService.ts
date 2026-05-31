import { api } from 'src/packages'

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
    return api.jsonRequest<DashboardMetrics>('GET', '/api/dashboard/metrics')
  }
}
