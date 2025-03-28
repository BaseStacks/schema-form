
import { FieldValues } from 'react-hook-form';
import { CustomFieldSchema, FieldSchemaType, RenderContext } from '../types';
import { useGlobalContext } from './useGlobalContext';

/**
 * Custom hook to get the appropriate field component for a schema
 * This follows React Hook naming conventions and rules
 */
export const useFieldComponent = <
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>(schema: FieldSchemaType<TRenderContext, TFormValue>) => {
    // Get custom fields from form context
    const { components: { fields } } = useGlobalContext();

    if (!schema.type) {
        const { Component } = schema as CustomFieldSchema<TRenderContext, TFormValue>;

        return Component;
    }

    const DefinedFieldComponent = fields[schema.type];

    if (!DefinedFieldComponent) {
        throw new Error(`No field component found for type: ${schema.type}`);
    }

    return DefinedFieldComponent;
};
