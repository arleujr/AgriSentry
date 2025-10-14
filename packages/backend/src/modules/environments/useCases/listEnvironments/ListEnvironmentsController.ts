import { Request, Response } from 'express';
import { PrismaEnvironmentsRepository } from '../../repositories/implementations/PrismaEnvironmentsRepository';
import { ListEnvironmentsService } from './ListEnvironmentsService';

export class ListEnvironmentsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id: user_id } = request.user; 

      const environmentsRepository = new PrismaEnvironmentsRepository();
      const listEnvironmentsService = new ListEnvironmentsService(
        environmentsRepository,
      );

      const environments = await listEnvironmentsService.execute(user_id);

      return response.json(environments);
    } catch (error) {

      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const listEnvironmentsController = new ListEnvironmentsController();