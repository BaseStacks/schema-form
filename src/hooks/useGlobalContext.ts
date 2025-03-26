import { useContext } from 'react';
import { SchemaFormGlobalContextType } from '../types';
import { SchemaFormGlobalContext } from '../contexts';

/**
 * Hook to access form context values and functionality
 * Must be used within a SchemaFormProvider component or its descendants
 */
export const useGlobalContext = () => {
    const context = useContext(SchemaFormGlobalContext);
    if (!context) {
        throw new Error('useFormContext must be used within a SchemaForm');
    }
    return context as SchemaFormGlobalContextType;
};
