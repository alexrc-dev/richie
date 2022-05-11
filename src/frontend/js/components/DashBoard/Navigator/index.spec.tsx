import { render, screen } from '@testing-library/react';
import * as mockFactories from 'utils/test/factories';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import DashBoardNavigator from './index';

jest.mock('utils/context', () => ({
  __esModule: true,
  default: mockFactories
    .ContextFactory({
      authentication: { backend: 'fonzie', endpoint: 'https://demo.endpoint' },
      joanie_backend: { endpoint: 'https://joanie.endpoint' },
    })
    .generate(),
}));

describe('<DashBoardNavigator />', () => {
  it('shows a dashboard', async () => {
    render(
      <IntlProvider locale="en">
        <MemoryRouter initialEntries={['/']}>
          <DashBoardNavigator />
        </MemoryRouter>
      </IntlProvider>,
    );

    const paths = ['/course', '/my-preferences'];
    const links = screen.getAllByRole('link');
    let hrefs: Array<string> = [];

    hrefs = links.reduce((res: Array<string>, item) => {
      if (item.hasAttribute('href') && item.getAttribute('href'))
        res.push(item.getAttribute('href') || '');
      return res;
    }, []);

    paths.forEach((path) => {
      expect(hrefs.includes(path)).toEqual(true);
    });
  });
});
