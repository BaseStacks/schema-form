import React from 'react';
import { createTest } from '@storybook/react/experimental-playwright';
import { test as base, expect } from '@playwright/experimental-ct-react';

import stories from '../src/ExamplesAdvance.stories.portable'

const test = createTest(base);

test('ExamplesAdvance', async ({ mount }) => {
    const component = await mount(<stories.I18n />);
    await expect(component).toContainText('Login');
});