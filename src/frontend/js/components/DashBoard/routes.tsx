import { RouteObject } from 'react-router-dom';
import { defineMessages, MessageDescriptor } from 'react-intl';

export interface DashBoardRoute extends RouteObject {
  intlPath?: MessageDescriptor;
  show: () => boolean;
  intlTitle: MessageDescriptor;
  title?: string;
  protected?: boolean;
}

export const messages = defineMessages({
  coursesDashBoardRouteTitle: {
    id: 'components.Dashboard.routes.courses.title',
    description: '',
    defaultMessage: 'Courses',
  },
  coursesDashBoardRoutePath: {
    id: 'components.Dashboard.routes.courses.path',
    description: '',
    defaultMessage: 'course',
  },
  preferencesDashBoardRouteTitle: {
    id: 'components.Dashboard.routes.preferences.title',
    description: '',
    defaultMessage: 'My preferencess',
  },
});

const dashboardRoutes: Array<DashBoardRoute> = [
  {
    element: <h2>Courses List</h2>,
    intlPath: messages.coursesDashBoardRoutePath,
    intlTitle: messages.coursesDashBoardRouteTitle,
    show: () => true,
    protected: true,
  },
  {
    element: <h2>My preferences</h2>,
    intlTitle: messages.preferencesDashBoardRouteTitle,
    show: () => true,
  },
];
export default dashboardRoutes;
