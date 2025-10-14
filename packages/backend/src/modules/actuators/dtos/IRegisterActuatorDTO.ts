import { ActuatorType } from '@prisma/client';

export interface IRegisterActuatorDTO {
  name: string;
  type: ActuatorType;
  environment_id: string;
}