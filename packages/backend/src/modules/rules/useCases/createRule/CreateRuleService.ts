import { Rule } from '@prisma/client';
import { IEnvironmentsRepository } from '../../../environments/repositories/IEnvironmentsRepository';
import { ISensorsRepository } from '../../../sensors/repositories/ISensorsRepository';
import { IActuatorsRepository } from '../../../actuators/repositories/IActuatorsRepository';
import { IRulesRepository } from '../../repositories/IRulesRepository';
import { ICreateRuleDTO } from '../../dtos/ICreateRuleDTO';

type IRequest = ICreateRuleDTO & { user_id: string };

export class CreateRuleService {
  constructor(
    private rulesRepository: IRulesRepository,
    private environmentsRepository: IEnvironmentsRepository,
    private sensorsRepository: ISensorsRepository,
    private actuatorsRepository: IActuatorsRepository,
  ) {}

  public async execute(data: IRequest): Promise<Rule> {
    const environment = await this.environmentsRepository.findByIdAndUserId(
      data.environment_id,
      data.user_id,
    );
    if (!environment) {
      throw new Error('Environment not found or user does not have permission.');
    }

    const triggerSensor = await this.sensorsRepository.findById(data.trigger_sensor_id);
    if (!triggerSensor || triggerSensor.environment_id !== data.environment_id) {
      throw new Error('Trigger sensor not found in this environment.');
    }

    const actionActuator = await this.actuatorsRepository.findById(data.action_actuator_id);
    if (!actionActuator || actionActuator.environment_id !== data.environment_id) {
      throw new Error('Action actuator not found in this environment.');
    }

    const { user_id, ...ruleData } = data;

    const rule = await this.rulesRepository.create(ruleData);
    
    return rule;
  }
}