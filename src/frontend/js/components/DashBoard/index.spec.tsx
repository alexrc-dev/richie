import { render, screen } from '@testing-library/react';
import * as mockFactories from 'utils/test/factories';
import { IntlProvider } from 'react-intl';
import JoanieApiProvider from 'data/JoanieApiProvider';
import { QueryClientProvider } from 'react-query';
import { PropsWithChildren } from 'react';
import createQueryClient from 'utils/react-query/createQueryClient';
import DashBoard from 'components/DashBoard';
import getBasename from './utils';

jest.mock('utils/context', () => ({
  __esModule: true,
  default: mockFactories
    .ContextFactory({
      authentication: { backend: 'fonzie', endpoint: 'https://demo.endpoint' },
      joanie_backend: { endpoint: 'https://joanie.endpoint' },
    })
    .generate(),
}));

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <IntlProvider locale="en">
    <QueryClientProvider client={createQueryClient()}>
      <JoanieApiProvider>{children}</JoanieApiProvider>
    </QueryClientProvider>
  </IntlProvider>
);

window.history.pushState({}, 'Default Page', getBasename('en'));
describe('<DashBoard />', () => {
  it('shows a dashboard', async () => {
    render(
      <Wrapper>
        <DashBoard />
      </Wrapper>,
    );

    expect(screen.getAllByRole('heading', { level: 1, name: 'Dashboard' }).length).toEqual(1);
  });
});
