
import { useGlobalContext } from './useGlobalContext';

/**
 * Custom hook to get the appropriate field component for a schema
 * This follows React Hook naming conventions and rules
 */
export const useFieldComponent = <TProps>(type: string) => {
    // Get custom fields from form context
    const { components: { fields } } = useGlobalContext();
    return fields[type] as React.ComponentType<TProps>;
};
