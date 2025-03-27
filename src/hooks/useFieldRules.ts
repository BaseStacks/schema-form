import { FieldValues } from 'react-hook-form';
import { useMemo } from 'react';
import { useGlobalContext } from './useGlobalContext';
import { getValidationRules, getValidationStats } from '../utils/fieldUtils';
import { FieldSchemaType } from '../types';

export const useFieldRules = <TFormValue extends FieldValues>(
    schema: FieldSchemaType<TFormValue>
) => {
    const { getDefaultMessages } = useGlobalContext();

    const rules = useMemo(() => {
        const validationStats = getValidationStats(schema);
        if (!validationStats) {
            return {};
        }

        const defaultMessages = getDefaultMessages?.(validationStats, schema);
        const validationOptions = getValidationRules(schema, defaultMessages);

        return validationOptions;
    }, [getDefaultMessages, schema]);

    return rules;
};
