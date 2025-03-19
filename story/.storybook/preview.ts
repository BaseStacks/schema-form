import '../src/tailwind.css';
import { themes } from '@storybook/theming';
import type { Preview } from '@storybook/react';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        darkMode: {
            dark: themes.dark,
            light: themes.normal
        }
    },

    tags: ['autodocs']
};

export default preview;
