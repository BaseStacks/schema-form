import React from 'react';

export const routes = [{
    path: '/validation',
    title: 'Validation',
    Component: React.lazy(() => import('./pages/validation')),
}, {
    path: '/validation-with-default-messages',
    title: 'Validation (with default messages)',
    Component: React.lazy(() => import('./pages/validation-with-default-messages')),
}, {
    path: '/custom-field-component',
    title: 'Custom Field Component',
    Component: React.lazy(() => import('./pages/custom-field-component')),
}, {
    path: '/field-visibility',
    title: 'Field Visibility',
    Component: React.lazy(() => import('./pages/field-visibility')),
}, {
    path: '/field-visibility-conditioned',
    title: 'Field Visibility (Conditioned)',
    Component: React.lazy(() => import('./pages/field-visibility-conditioned')),
}];
