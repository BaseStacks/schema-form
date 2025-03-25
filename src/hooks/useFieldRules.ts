import { FieldPath, FieldValues, RegisterOptions, UseFormReturn } from 'react-hook-form';
import { useMemo } from 'react';
import { useGlobalContext } from './useGlobalContext';
import { getValidationRules, getValidationStats } from '../utils/fieldUtils';

export const useFieldRules = <TFormValue extends FieldValues>(
    form: UseFormReturn<TFormValue>,
    name: FieldPath<TFormValue> | string,
    options: RegisterOptions<TFormValue>
) => {
    const { getDefaultMessages } = useGlobalContext();

    const rules = useMemo(() => {
        const validationStats = getValidationStats(options);
        if (!validationStats) {
            return {};
        }

        const defaultMessages = getDefaultMessages(validationStats, options);
        const validationOptions = getValidationRules(options, defaultMessages);

        return validationOptions;
    }, [getDefaultMessages, options, form, name]);

    return rules;
};
