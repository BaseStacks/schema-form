import { useCallback } from 'react';

import { useGlobalContext } from './useGlobalContext';

export function useSubmit(formId: string) {
    const { formMap } = useGlobalContext();

    return useCallback(() => {
        const formMethods = formMap.get(formId);
        if (!formMethods) {
            throw new Error(`Form with ID "${formId}" is not registered.`);
        }
        return formMethods.submit();
    }, [formId, formMap]);
};
