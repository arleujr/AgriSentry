import { SensorReading } from '@prisma/client';
import { IReadingsRepository } from '../../repositories/IReadingsRepository';
import { ISensorsRepository } from '../../../sensors/repositories/ISensorsRepository';
import { io } from '../../../../server';
import { IRulesRepository } from '../../../rules/repositories/IRulesRepository';
import { IActuatorsRepository } from '../../../actuators/repositories/IActuatorsRepository';
import { IActuatorLogsRepository } from '../../../actuator-logs/repositories/IActuatorLogsRepository';
interface IRequest {
  value: number;
  sensor_id: string;
  environment_id: string;
}

export class CreateReadingService {
  constructor(
    private readingsRepository: IReadingsRepository,
    private sensorsRepository: ISensorsRepository,
    private rulesRepository: IRulesRepository,
    private actuatorsRepository: IActuatorsRepository,
    private actuatorLogsRepository: IActuatorLogsRepository 
  ) {}

  public async execute({ value, sensor_id, environment_id }: IRequest): Promise<SensorReading> {
    const sensor = await this.sensorsRepository.findById(sensor_id);
    if (!sensor || sensor.environment_id !== environment_id) {
      throw new Error('Sensor not found in this environment.');
    }

    const reading = await this.readingsRepository.create({
      value,
      sensor_id,
    });

    io.emit('new_reading', reading);

    const rules = await this.rulesRepository.findByTriggerSensorId(sensor_id);

    for (const rule of rules) {
      let shouldTakeAction = false;

      if (rule.trigger_condition === 'GREATER_THAN' && value > rule.trigger_value) {
        shouldTakeAction = true;
      } else if (rule.trigger_condition === 'LESS_THAN' && value < rule.trigger_value) {
        shouldTakeAction = true;
      }

      if (shouldTakeAction) {
        const actuator = await this.actuatorsRepository.findById(rule.action_actuator_id);

        if (actuator && actuator.control_mode === 'AUTOMATIC') {
          const newState = rule.action_type === 'TURN_ON';
          if (actuator.is_on !== newState) {
            actuator.is_on = newState;
            const updatedActuator = await this.actuatorsRepository.save(actuator);

            await this.actuatorLogsRepository.create({
              actuator_id: updatedActuator.id,
              action: updatedActuator.is_on ? 'TURNED_ON' : 'TURNED_OFF',
              triggered_by: 'AUTOMATIC',
            });

            io.emit('actuator_toggled', updatedActuator);
            console.log(`REGRA '${rule.name}' DISPARADA: Atuador '${actuator.name}' foi ${newState ? 'LIGADO' : 'DESLIGADO'}.`);
          }
        }
      }
    }

    return reading;
  }
}
