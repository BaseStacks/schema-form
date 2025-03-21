import { FieldPath, FieldValues, RegisterOptions, UseFormReturn } from 'react-hook-form';
import { useMemo } from 'react';
import { useGlobalContext } from './useGlobalContext';
import { getValidationOptions, getValidationStats } from '../utils/fieldUtils';

export const useFieldRegister = <TFormValue extends FieldValues>(
    form: UseFormReturn<TFormValue>,
    name: FieldPath<TFormValue>,
    options: RegisterOptions<TFormValue>
) => {
    const { getDefaultMessages } = useGlobalContext();

    const fieldProps = useMemo(() => {
        const validationStats = getValidationStats(options);
        if (!validationStats) {
            return form.register(name, options);
        }

        const defaultMessages = getDefaultMessages(validationStats, options);
        const validationOptions = getValidationOptions(options, defaultMessages);

        return form.register(name, {
            ...options,
            ...validationOptions
        });
    }, [getDefaultMessages, options, form, name]);

    return fieldProps;
};
