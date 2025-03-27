import { FieldError, FieldPath, FieldValues } from 'react-hook-form';
import { BaseFieldSchema, CustomFieldSchema, RenderContext, SchemaFieldContextType } from '../types';
import { useFieldStatus } from '../hooks/useFieldStatus';
import { useFieldSchema } from '../hooks/useFieldSchema';
import { useSchemaForm } from '../hooks/useSchemaForm';
import { useMemo } from 'react';
import { useFieldComponent } from '../hooks/useFieldComponent';
import { SchemaFieldContext } from '../contexts';

export interface SchemaFormFieldProps<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
> {
    readonly name: FieldPath<TFormValue>;
    readonly renderContext?: TRenderContext;
}

export function SchemaFormField<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>({ name, renderContext }: SchemaFormFieldProps<TRenderContext, TFormValue>) {
    const { form, renderContext: formRenderContext } = useSchemaForm<TFormValue>();
    const formValues = form.getValues();

    const schema = useFieldSchema<TFormValue, TRenderContext>(name);

    const FieldComponent = useFieldComponent(schema?.type);

    const fieldStatus = useFieldStatus(schema as BaseFieldSchema, formValues);
    const fieldRenderContext = useMemo(
        () => Object.assign({}, formRenderContext, schema.renderContext, renderContext),
        [renderContext, schema.renderContext, formRenderContext]
    );

    if (!fieldStatus.isVisible) {
        return null;
    }

    const error = form.formState.errors[name] as FieldError | undefined;

    const fieldContext: SchemaFieldContextType<TRenderContext, TFormValue> = {
        form,
        name,
        error,
        schema,
        renderContext: fieldRenderContext
    };

    const renderField = () => {
        if (!schema.type) {
            const { Component } = schema as CustomFieldSchema<RenderContext, TFormValue>;

            return (
                <Component />
            );
        }

        if (!FieldComponent) {
            throw new Error(`No field component found for type: ${schema.type}`);
        }

        return (
            <FieldComponent />
        );
    };

    return (
        <SchemaFieldContext.Provider value={fieldContext}>
            {renderField()}
        </SchemaFieldContext.Provider>
    );
}
