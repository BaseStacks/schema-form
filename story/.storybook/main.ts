import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: [
        '../stories/Readme.stories.@(js|jsx|ts|tsx)',
        '../stories/*.stories.@(js|jsx|ts|tsx)'
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        'storybook-dark-mode'
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {
            builder: {
                viteConfigPath: 'vite.config.mts',
            }
        },
    },
    docs: {
        autodocs: true,
    },
};

export default config;
