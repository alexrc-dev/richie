import { BrowserRouter } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Navigator from './Navigator';
import getBasename from './utils';

const DashBoard = () => {
  const intl = useIntl();

  return (
    <BrowserRouter basename={getBasename(intl.locale)}>
      <h1>Dashboard</h1>
      <Navigator />
    </BrowserRouter>
  );
};

export default DashBoard;
