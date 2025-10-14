import { Rule } from '@prisma/client';
import { prisma } from '../../../../shared/database/prisma';
import { ICreateRuleDTO } from '../../dtos/ICreateRuleDTO';
import { IRulesRepository } from '../IRulesRepository';

export class PrismaRulesRepository implements IRulesRepository {
  async create(data: ICreateRuleDTO): Promise<Rule> {
    const rule = await prisma.rule.create({ data });
    return rule;
  }

  async findByEnvironmentId(environment_id: string): Promise<Rule[]> {
    const rules = await prisma.rule.findMany({
      where: { environment_id },
      include: {
        trigger_sensor: { select: { name: true } },
        action_actuator: { select: { name: true } },
      },
    });
    // @ts-ignore
    return rules;
  }

  async findById(id: string): Promise<Rule | null> {
    const rule = await prisma.rule.findUnique({
      where: { id },
    });
    return rule;
  }

  async delete(id: string): Promise<void> {
    await prisma.rule.delete({
      where: { id },
    });
  }

  async deleteBySensorId(sensor_id: string): Promise<void> {
    await prisma.rule.deleteMany({
      where: { trigger_sensor_id: sensor_id },
    });
  }

  // ADICIONADO: busca todas as regras associadas a um sensor específico
  async findByTriggerSensorId(sensor_id: string): Promise<Rule[]> {
    const rules = await prisma.rule.findMany({
      where: { trigger_sensor_id: sensor_id },
    });
    return rules;
  }
}
