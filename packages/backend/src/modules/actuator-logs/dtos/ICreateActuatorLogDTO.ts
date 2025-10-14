export interface ICreateActuatorLogDTO {
  actuator_id: string;
  action: 'TURNED_ON' | 'TURNED_OFF';
  triggered_by: 'MANUAL' | 'AUTOMATIC';
}