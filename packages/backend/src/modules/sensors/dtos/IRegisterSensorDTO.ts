import { SensorType } from '@prisma/client';

export interface IRegisterSensorDTO {
  name: string;
  type: SensorType;
  environment_id: string;
}