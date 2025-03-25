import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: [
        '../src/stories/**/*/*.stories.@(js|jsx|ts|tsx)'
    ],

    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        'storybook-dark-mode',
        '@chromatic-com/storybook'
    ],

    framework: {
        name: '@storybook/react-vite',
        options: {
            builder: {
                viteConfigPath: 'vite.config.mts'
            }
        },
    },

    docs: {},

    typescript: {
        reactDocgen: 'react-docgen-typescript'
    }
};

export default config;
