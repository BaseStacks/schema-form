import { useContext } from 'react';
import { JsonFormGlobalContextType } from '../types';
import { JsonFormGlobalContext } from '../contexts';

/**
 * Hook to access form context values and functionality
 * Must be used within a JsonFormProvider component or its descendants
 */
export const useGlobalContext = () => {
    const context = useContext(JsonFormGlobalContext);
    if (!context) {
        throw new Error('useFormContext must be used within a SchemaForm');
    }
    return context as Required<JsonFormGlobalContextType>;
};
