import {
    PropsWithChildren,
    useCallback,
    useMemo,
    useRef,
} from 'react';

import { SchemaFormGlobalContext } from '../contexts';
import {
    FormMethods,
    SchemaFormGlobalContextType,
} from '../types';

type SchemaFormProviderProps = PropsWithChildren<Omit<SchemaFormGlobalContextType, 'registerForm' | 'formMap'>>;

/**
 * Provides a context for managing schema form global state.
 * 
 * This component wraps its children with a `SchemaFormGlobalContext.Provider`
 * and passes the provided props as the context value.
 * 
 * @param props - {@link SchemaFormGlobalContextType}
 */
export function SchemaFormProvider({ children, ...props }: SchemaFormProviderProps) {

    const formMapRef = useRef<Map<string, FormMethods>>(new Map());

    const registerForm = useCallback((formId: string, formMethods: FormMethods) => {
        formMapRef.current.set(formId, formMethods);

        return () => {
            formMapRef.current.delete(formId);
        };
    }, []);

    const contextValue: SchemaFormGlobalContextType = useMemo(() => ({
        ...props,
        formMap: formMapRef.current,
        registerForm
    }), [props, formMapRef, registerForm]);

    return (
        <SchemaFormGlobalContext.Provider value={contextValue}>
            {children}
        </SchemaFormGlobalContext.Provider>
    );
};
