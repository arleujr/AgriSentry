export interface ICreateRuleDTO {
  name: string;
  environment_id: string;
  trigger_sensor_id: string;
  trigger_condition: string; 
  trigger_value: number;
  action_actuator_id: string;
  action_type: string; 
}