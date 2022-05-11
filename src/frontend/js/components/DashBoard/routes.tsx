import { RouteObject } from 'react-router-dom';
import { defineMessages, MessageDescriptor } from 'react-intl';
import CourseList from './Views/CourseList';

export interface DashBoardRoute extends RouteObject {
  noIntlPath?: MessageDescriptor;
  show: () => boolean;
  noIntlTitle: MessageDescriptor;
  title?: string;
}

export const messages = defineMessages({
  dashboardRoutePath: {
    id: 'components.Dashboard.routes.dashboard.path',
    description: '',
    defaultMessage: 'dashboard',
  },
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
    defaultMessage: 'My preferences',
  },
});

const dashboardRoutes: Array<DashBoardRoute> = [
  {
    element: <CourseList />,
    noIntlPath: messages.coursesDashBoardRoutePath,
    noIntlTitle: messages.coursesDashBoardRouteTitle,
    show: () => true,
  },
  {
    element: <h2>My preferences</h2>,
    noIntlTitle: messages.preferencesDashBoardRouteTitle,
    show: () => true,
  },
];
export default dashboardRoutes;
