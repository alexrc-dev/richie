import { NavLink, useRoutes } from 'react-router-dom';
import { ReactNode } from 'react';
import { defineMessages } from 'react-intl';
import useDashboardRoutes from '../../hooks/useDashboardRoutes';

export const messages = defineMessages({
  loadingNavigator: {
    id: 'components.Dashboard.Router.loadingInitial',
    defaultMessage: 'Loading navigator',
    description:
      'Accessible text for the initial loading spinner displayed when navigator is fetching',
  },
});

const DashBoardNavigator = () => {
  const { routes } = useDashboardRoutes();
  const routesNode = useRoutes(routes);

  if (!routes) {
    throw new Error('dashboardRoutes has not been found !');
  }
  return (
    <>
      <nav>
        {routes
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
