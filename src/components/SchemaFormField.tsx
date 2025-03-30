import { FieldPath, FieldValues } from 'react-hook-form';
import { BaseFieldSchema, ConditionedRule, RenderContext, SchemaFieldContextType } from '../types';
import { useFieldStatus } from '../hooks/useFieldStatus';
import { useFieldSchema } from '../hooks/useFieldSchema';
import { useSchemaForm } from '../hooks/useSchemaForm';
import { useMemo } from 'react';
import { useFieldComponent } from '../hooks/useFieldComponent';
import { SchemaFieldContext } from '../contexts';
import { useFieldRules } from '../hooks/useFieldRules';

export interface SchemaFormFieldProps<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
> {
    readonly name: FieldPath<TFormValue>;
    readonly renderContext?: TRenderContext;
}

/**
 * A React component that renders a schema-based form field. This component is designed to work
 * with a schema-driven form system, where the field's behavior, validation, and rendering are
 * determined by its schema definition.
 *
 * @param props - {@link SchemaFormFieldProps}
 *
 * @returns The rendered field component, or `null` if the field is not visible.
 */
export function SchemaFormField<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>({ name, renderContext }: SchemaFormFieldProps<TRenderContext, TFormValue>) {
    const { form, renderContext: formRenderContext } = useSchemaForm<TRenderContext, TFormValue>();

    const schema = useFieldSchema<TFormValue, TRenderContext>(name);
    const rules = useFieldRules(schema);

    const FieldComponent = useFieldComponent(schema);
    const fieldRenderContext = useMemo(
        () => ({
            ...(formRenderContext ?? {}),
            ...(schema.renderContext ?? {}),
            ...(renderContext ?? {}),
        } as TRenderContext),
        [renderContext, schema.renderContext, formRenderContext]
    );

    const fieldContext = useMemo((): SchemaFieldContextType<TRenderContext, TFormValue> => ({
        form,
        name,
        schema,
        rules,
        renderContext: fieldRenderContext
    }), [form, name, schema, rules, fieldRenderContext]);

    const renderField = () => {
        if (schema.visible === undefined || schema.visible === true) {
            return <FieldComponent />;
        }

        if (schema.visible === false) {
            return null;
        }

        return (
            <FieldVisibilityCheck schema={schema}>
                <FieldComponent />
            </FieldVisibilityCheck>
        );
    };

    return (
        <SchemaFieldContext.Provider value={fieldContext}>
            {renderField()}
        </SchemaFieldContext.Provider>
    );
}

interface FieldVisibilityCheckProps<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
> {
    readonly schema: BaseFieldSchema<TRenderContext, TFormValue>;
    readonly children: React.ReactNode;
}

function FieldVisibilityCheck<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>({ schema, children }: FieldVisibilityCheckProps<TRenderContext, TFormValue>) {
    const { isVisible } = useFieldStatus(schema.visible as ConditionedRule<TFormValue>);
    if (!isVisible) {
        return null;
    }

    return children;
};
