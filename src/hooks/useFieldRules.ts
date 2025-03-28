import { FieldValues } from 'react-hook-form';
import { useMemo } from 'react';
import { useGlobalContext } from './useGlobalContext';
import { getValidationRules, getValidationStats } from '../utils/fieldUtils';
import { FieldSchemaType, RenderContext, ValidationRules } from '../types';

export const useFieldRules = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>(schema: FieldSchemaType<TRenderContext, TFormValue>) => {
    const { getDefaultMessages } = useGlobalContext();

    const rules = useMemo((): ValidationRules => {
        const validationStats = getValidationStats(schema);
        if (!validationStats) {
            return {
                stats: {},
            };
        }

        const defaultMessages = getDefaultMessages?.(validationStats, schema);
        const validationOptions = getValidationRules(schema, defaultMessages);

        return validationOptions;
    }, [getDefaultMessages, schema]);

    return rules;
};
