import { PropsWithChildren } from 'react';

import { SchemaFormGlobalContext } from '../contexts';
import { SchemaFormGlobalContextType } from '../types';

/**
 * Provides a context for managing schema form global state.
 * 
 * This component wraps its children with a `SchemaFormGlobalContext.Provider`
 * and passes the provided props as the context value.
 * 
 * @param {PropsWithChildren<SchemaFormGlobalContextType>} props - {@link SchemaFormGlobalContextType}
 */
export function SchemaFormProvider({ children, ...props }: PropsWithChildren<SchemaFormGlobalContextType>) {
    return (
        <SchemaFormGlobalContext.Provider value={props}>
            {children}
        </SchemaFormGlobalContext.Provider>
    );
};
