import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import slugify from 'slugify';
import dashboardRoutes, { DashBoardRoute } from 'components/DashBoard/routes';

const useDashBoardRoutes = () => {
  const intl = useIntl();

  const intlDashboardRoutes = useMemo<Array<DashBoardRoute>>(() => {
    return dashboardRoutes.map((dashboardRoute) => ({
      path: dashboardRoute.noIntlPath
        ? intl.formatMessage(dashboardRoute.noIntlPath)
        : slugify(intl.formatMessage(dashboardRoute.noIntlTitle), { lower: true }),
      title: intl.formatMessage(dashboardRoute.noIntlTitle),
      ...dashboardRoute,
    }));
  }, []);

  return { intlDashboardRoutes };
};

export default useDashBoardRoutes;
