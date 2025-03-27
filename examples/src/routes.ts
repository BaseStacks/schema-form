import React from 'react';

export const routes = [{
    path: '/validation',
    title: 'Validation',
    Component: React.lazy(() => import('./pages/validation')),
}, {
    path: '/validation-with-default-messages',
    title: 'Validation (with default messages)',
    Component: React.lazy(() => import('./pages/validation-with-default-messages')),
}];
