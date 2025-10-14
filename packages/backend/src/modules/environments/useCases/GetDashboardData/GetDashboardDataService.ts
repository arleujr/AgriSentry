import { prisma } from '../../../../shared/database/prisma';

export class GetDashboardDataService {
  public async execute(user_id: string) {
    const environments = await prisma.environment.findMany({
      where: { user_id },
      include: {
        _count: { 
          select: { sensors: true }
        },
        sensors: { 
          include: {
            readings: {
              orderBy: { created_at: 'desc' },
              take: 1,
            }
          }
        }
      }
    });
    return environments;
  }
}