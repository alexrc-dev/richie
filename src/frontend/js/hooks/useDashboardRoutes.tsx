import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import slugify from 'slugify';
import dashboardRoutes, { DashBoardRoute } from 'components/DashBoard/routes';
import { useSession } from 'data/SessionProvider';
import ProtectedRoute from '../components/DashBoard/ProtectedRoute';

const useDashBoardRoutes = () => {
  const intl = useIntl();

  const { user } = useSession();

  const routes = useMemo<Array<DashBoardRoute>>(() => {
    return dashboardRoutes.map((dashboardRoute) => ({
      ...dashboardRoute,
      path: dashboardRoute.intlPath
        ? intl.formatMessage(dashboardRoute.intlPath)
        : slugify(intl.formatMessage(dashboardRoute.intlTitle), { lower: true }),
      title: intl.formatMessage(dashboardRoute.intlTitle),
      element:
        dashboardRoute.protected === true ? (
          <ProtectedRoute isAllowed={!!user} redirectPath="/">
            {dashboardRoute.element}
          </ProtectedRoute>
        ) : (
          dashboardRoute.element
        ),
    }));
  }, [user]);

  return { routes };
};

export default useDashBoardRoutes;
