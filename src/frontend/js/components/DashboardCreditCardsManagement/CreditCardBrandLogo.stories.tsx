import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CreditCardBrandLogo } from 'components/DashboardCreditCardsManagement/CreditCardBrandLogo';
import { CreditCardFactory } from 'utils/test/factories';
import { CreditCard, CreditCardBrand } from 'types/Joanie';

export default {
  title: 'Components/CreditCardBrandLogo',
  component: CreditCardBrandLogo,
} as ComponentMeta<typeof CreditCardBrandLogo>;

const Template: ComponentStory<typeof CreditCardBrandLogo> = (args) => (
  <CreditCardBrandLogo {...args} />
);

const creditCard: CreditCard = CreditCardFactory.generate();

export const Visa = Template.bind({});
Visa.args = {
  creditCard: { ...creditCard, brand: CreditCardBrand.VISA },
};

export const Mastercard = Template.bind({});
Mastercard.args = {
  creditCard: { ...creditCard, brand: CreditCardBrand.MASTERCARD },
};

export const Maestro = Template.bind({});
Maestro.args = {
  creditCard: { ...creditCard, brand: CreditCardBrand.MAESTRO },
};

export const CB = Template.bind({});
CB.args = {
  creditCard: { ...creditCard, brand: CreditCardBrand.CB },
};
