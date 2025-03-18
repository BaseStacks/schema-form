import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library
configure({
    // Set the wait time for async operations
    asyncUtilTimeout: 5000,
});
