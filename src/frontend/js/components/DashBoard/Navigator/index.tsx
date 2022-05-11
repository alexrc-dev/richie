import { NavLink, useRoutes } from 'react-router-dom';
import { ReactNode } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useDashboardRoutes from '../../../hooks/useDashboardRoutes';
import { Spinner } from '../../Spinner';

export const messages = defineMessages({
  loadingNavigator: {
    id: 'components.Dashboard.Navigator.loadingInitial',
    defaultMessage: 'Loading navigator',
    description:
      'Accessible text for the initial loading spinner displayed when navigator is fetching',
  },
});

const DashBoardNavigator = () => {
  const { intlDashboardRoutes } = useDashboardRoutes();
  const routesNode = useRoutes(intlDashboardRoutes);

  if (!intlDashboardRoutes) {
    return (
      <Spinner aria-labelledby="loading-routes">
        <span id="loading-course">
          <FormattedMessage {...messages.loadingNavigator} />
        </span>
      </Spinner>
    );
  }

  return (
    <>
      <nav>
        {intlDashboardRoutes
          .filter((route) => route.path && route.title)
          .map<ReactNode>((route, index): ReactNode => {
            return (
              <NavLink to={route.path as string} key={`nav_${index}`}>
                {route.title}
              </NavLink>
            );
          })}
      </nav>
      {routesNode}
    </>
  );
};

export default DashBoardNavigator;
