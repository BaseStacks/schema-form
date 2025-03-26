import { ArrayPath, FieldPath, FieldValues, useFieldArray } from 'react-hook-form';
import { WithArrayProps, FieldHocProps, RenderContext, ArrayFieldSchema } from '../../types';
import { SchemaFormField } from '../SchemaFormField';
import { useCallback, useMemo } from 'react';
import { getValidationStats } from '../../utils/fieldUtils';
import { useFieldRules } from '../../hooks/useFieldRules';

export interface WithArrayHocProps<
    TRenderContext extends RenderContext,
    TFormValue extends FieldValues,
    TFieldValue extends FieldValues
> extends Omit<FieldHocProps<TRenderContext, TFormValue, TFieldValue>, 'name'> {
    readonly name: ArrayPath<TFormValue>;
}

export function withArray<TRenderContext extends RenderContext = RenderContext>(
    Component: React.ComponentType<WithArrayProps<TRenderContext, any, any>>
) {
    return function ArrayFieldHoc<TFieldValue extends FieldValues, TFormValue extends FieldValues>({
        form,
        schema,
        name,
        renderContext,
        error
    }: WithArrayHocProps<TRenderContext, TFormValue, TFieldValue>) {

        const arraySchema = schema as ArrayFieldSchema<TRenderContext, TFormValue, TFieldValue[]>;
        const rules = useFieldRules(arraySchema);

        // Use fieldArray from react-hook-form to manage the array items
        const array = useFieldArray({
            name,
            control: form.control,
            rules
        });

        const { fields } = array;

        // Get min/max items constraints from field
        const minItems = typeof rules.minLength === 'number' ? rules.minLength : rules.minLength?.value;
        const maxItems = typeof rules.maxLength === 'number' ? rules.maxLength : isNaN(rules.maxLength?.value) ? Infinity : rules.maxLength.value;

        // Check if we can add more items
        const canAddItem = !maxItems || fields.length < maxItems;
        // Check if we can remove items
        const canRemoveItem = fields.length > minItems;

        const renderItem = useCallback((index: number) => {
            const key = `${name}[${index}]` as FieldPath<TFormValue>;
            return <SchemaFormField key={key} name={key} renderContext={renderContext} />;
        }, [name, renderContext]); // Add fields as dependency

        const validationStats = useMemo(() => getValidationStats(rules), [rules]);

        return (
            <Component
                array={array}
                schema={arraySchema}
                name={name}
                title={arraySchema.title}
                description={arraySchema.description}
                placeholder={arraySchema.placeholder}
                canAddItem={canAddItem}
                canRemoveItem={canRemoveItem}
                renderItem={renderItem}
                renderContext={renderContext}
                error={error}
                required={validationStats.required}
                minLength={minItems}
                maxLength={maxItems}
            />
        );
    };
};

