import React from 'react';

export const routes = [{
    path: '/basic',
    title: 'Basic',
    Component: React.lazy(() => import('./pages/basic')),
}, {
    path: '/basic-with-default-messages',
    title: 'Basic (with default messages)',
    Component: React.lazy(() => import('./pages/basic-with-default-messages')),
}];
