import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { LoginPage } from '../pages/Login';
import { RegisterPage } from '../pages/Register';
import { DashboardPage } from '../pages/Dashboard';
import { EnvironmentDetailsPage } from '../pages/EnvironmentDetails';
import { SensorDetailsPage } from '../pages/SensorDetails';
import { CreateRulePage } from '../pages/CreateRule';
import { ProtectedRoute } from '../components/ProtectedRoute'; 
import { CreateEnvironmentPage } from '../pages/CreateEnvironment';
import { ActuatorDetailsPage } from '../pages/ActuatorDetails';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Rotas Públicas
      {
        path: '/',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      // Rotas Protegidas
      {
        element: <ProtectedRoute />, 
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/environments/:environmentId',
            element: <EnvironmentDetailsPage />,
          },
          {
            path: '/sensors/:sensorId',
            element: <SensorDetailsPage />,
          },
          {
            path: '/environments/:environmentId/rules/new',
            element: <CreateRulePage />,
          },
          {
            path: '/environments/new',
            element: <CreateEnvironmentPage />,
          },
          {
            path: '/actuators/:actuatorId',
            element: <ActuatorDetailsPage />,
          },
        ],
      },
    ],
  },
]);
