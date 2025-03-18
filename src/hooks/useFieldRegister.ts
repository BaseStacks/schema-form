import { FieldPath, FieldValues, RegisterOptions, UseFormReturn } from 'react-hook-form';
import { useMemo } from 'react';
import { useGlobalContext } from './useGlobalContext';
import { getValidationOptions, getValidationStats } from '../utils/fieldUtils';

export const useFieldRegister = <TFormValue extends FieldValues>(
    form: UseFormReturn<TFormValue>,
    name: FieldPath<TFormValue>,
    field: RegisterOptions<TFormValue>
) => {
    const { getDefaultMessages } = useGlobalContext();

    const fieldProps = useMemo(() => {
        const validationStats = getValidationStats(field);
        if (!validationStats) {
            return form.register(name, field);
        }

        const defaultMessages = getDefaultMessages(validationStats, field);
        const validationOptions = getValidationOptions(field, defaultMessages);

        return form.register(name, {
            ...field,
            ...validationOptions
        });
    }, [getDefaultMessages, field, form, name]);

    return fieldProps;
};
