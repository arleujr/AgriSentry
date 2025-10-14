import { Router } from 'express';
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';
import { ensureApiKeyAuthenticated } from './middlewares/ensureApiKeyAuthenticated';

// Users
import { createUserController } from '../modules/users/useCases/createUser/CreateUserController';
import { authenticateUserController } from '../modules/users/useCases/authenticateUser/AuthenticateUserController';

// Environments
import { createEnvironmentController } from '../modules/environments/useCases/createEnvironment/CreateEnvironmentController';
import { listEnvironmentsController } from '../modules/environments/useCases/listEnvironments/ListEnvironmentsController';
import { getEnvironmentDetailsController } from '../modules/environments/useCases/getEnvironmentDetails/GetEnvironmentDetailsController';
import { deleteEnvironmentController } from '../modules/environments/useCases/deleteEnvironment/DeleteEnvironmentController';
import { getEnvironmentStatsController } from '../modules/environments/useCases/getEnvironmentStats/GetEnvironmentStatsController';
import { getDashboardDataController } from '../modules/environments/useCases/getDashboardData/GetDashboardDataController';

// Sensors
import { registerSensorController } from '../modules/sensors/useCases/registerSensor/RegisterSensorController';
import { listSensorsController } from '../modules/sensors/useCases/listSensorsByEnvironment/ListSensorsController';
import { getSensorDetailsController } from '../modules/sensors/useCases/getSensorDetails/GetSensorDetailsController';
import { deleteSensorController } from '../modules/sensors/useCases/deleteSensor/DeleteSensorController';

// Actuators
import { registerActuatorController } from '../modules/actuators/useCases/registerActuator/RegisterActuatorController';
import { listActuatorsController } from '../modules/actuators/useCases/listActuatorsByEnvironment/ListActuatorsController';
import { toggleActuatorStateController } from '../modules/actuators/useCases/toggleActuatorState/ToggleActuatorStateController';
import { setActuatorModeController } from '../modules/actuators/useCases/setActuatorMode/SetActuatorModeController';
import { deleteActuatorController } from '../modules/actuators/useCases/deleteActuator/DeleteActuatorController';
import { getActuatorDetailsController } from '../modules/actuators/useCases/getActuatorDetails/GetActuatorDetailsController';
import { getActuatorStateByDeviceController } from '../modules/actuators/useCases/getActuatorStateByDevice/GetActuatorStateByDeviceController';

// Readings
import { createReadingController } from '../modules/readings/useCases/createReading/CreateReadingController';
import { getLatestReadingController } from '../modules/readings/useCases/getLatestReading/GetLatestReadingController';
import { listReadingsBySensorController } from '../modules/readings/useCases/listReadingsBySensor/ListReadingsBySensorController';

// Rules
import { createRuleController } from '../modules/rules/useCases/createRule/CreateRuleController';
import { listRulesByEnvironmentController } from '../modules/rules/useCases/listRulesByEnvironment/ListRulesByEnvironmentController';
import { deleteRuleController } from '../modules/rules/useCases/deleteRule/DeleteRuleController';

// Actuator Logs
import { listActuatorLogsController } from '../modules/actuator-logs/useCases/listActuatorLogs/ListActuatorLogsController';

const router = Router();

// =================================
// --- Rotas Públicas ---
// =================================
router.post('/users', createUserController.handle);
router.post('/sessions', authenticateUserController.handle);

// =================================
// --- Rotas de Dispositivos (API Key) ---
// =================================
router.post('/readings', ensureApiKeyAuthenticated, createReadingController.handle);
router.get('/device/actuators/:actuatorId/state', ensureApiKeyAuthenticated, getActuatorStateByDeviceController.handle);

// =================================
// --- Rotas Autenticadas (JWT) ---
// =================================
router.get('/dashboard', ensureAuthenticated, getDashboardDataController.handle);

// -- Environments & Sub-resources --
router.get('/environments', ensureAuthenticated, listEnvironmentsController.handle);
router.post('/environments', ensureAuthenticated, createEnvironmentController.handle);
router.get('/environments/:environmentId', ensureAuthenticated, getEnvironmentDetailsController.handle);
router.delete('/environments/:environmentId', ensureAuthenticated, deleteEnvironmentController.handle);
router.get('/environments/:environmentId/stats', ensureAuthenticated, getEnvironmentStatsController.handle);
router.get('/environments/:environmentId/sensors', ensureAuthenticated, listSensorsController.handle);
router.post('/environments/:environmentId/sensors', ensureAuthenticated, registerSensorController.handle);
router.get('/environments/:environmentId/actuators', ensureAuthenticated, listActuatorsController.handle);
router.post('/environments/:environmentId/actuators', ensureAuthenticated, registerActuatorController.handle);
router.get('/environments/:environmentId/rules', ensureAuthenticated, listRulesByEnvironmentController.handle);

// -- Standalone Resources --
router.get('/sensors/:sensorId', ensureAuthenticated, getSensorDetailsController.handle);
router.delete('/sensors/:sensorId', ensureAuthenticated, deleteSensorController.handle);
router.get('/sensors/:sensorId/readings', ensureAuthenticated, listReadingsBySensorController.handle);
router.get('/sensors/:sensorId/latest-reading', ensureAuthenticated, getLatestReadingController.handle);

router.get('/actuators/:actuatorId', ensureAuthenticated, getActuatorDetailsController.handle);
router.delete('/actuators/:actuatorId', ensureAuthenticated, deleteActuatorController.handle);
router.patch('/actuators/:actuatorId/toggle', ensureAuthenticated, toggleActuatorStateController.handle);
router.patch('/actuators/:actuatorId/mode', ensureAuthenticated, setActuatorModeController.handle);
router.get('/actuators/:actuatorId/logs', ensureAuthenticated, listActuatorLogsController.handle);

router.post('/rules', ensureAuthenticated, createRuleController.handle);
router.delete('/rules/:ruleId', ensureAuthenticated, deleteRuleController.handle);

export { router };