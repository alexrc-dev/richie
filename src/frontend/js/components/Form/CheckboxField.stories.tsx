import { ComponentMeta, ComponentStory } from '@storybook/react';
import { defaultConfig } from './Field.stories';
import { CheckboxField as Base } from './index';

export default {
  title: 'Components/Inputs',
  component: Base,
  ...defaultConfig,
} as ComponentMeta<typeof Base>;

const Template: ComponentStory<typeof Base> = (args) => <Base {...args} />;

export const CheckboxField = Template.bind({});
