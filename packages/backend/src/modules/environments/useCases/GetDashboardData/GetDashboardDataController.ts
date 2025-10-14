import { Request, Response } from 'express';
import { GetDashboardDataService } from './GetDashboardDataService';

export class GetDashboardDataController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id: user_id } = request.user;

      const getDashboardDataService = new GetDashboardDataService();

      const dashboardData = await getDashboardDataService.execute(user_id);

      return response.json(dashboardData);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const getDashboardDataController = new GetDashboardDataController();