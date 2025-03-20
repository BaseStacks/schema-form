import { FieldError, FieldPath, FieldValues } from 'react-hook-form';
import { BaseFieldSchema, CustomFieldSchema, FieldWrapperProps, RenderContext } from '../types';
import { useFieldStatus } from '../hooks/useFieldStatus';
import { useFieldSchema } from '../hooks/useFieldSchema';
import { useSchemaForm } from '../hooks/useSchemaForm';
import { useMemo } from 'react';
import { useFieldComponent } from '../hooks/useFieldComponent';

export interface SchemaFormFieldProps<TFormValue extends FieldValues = FieldValues, TRenderContext extends RenderContext = RenderContext> {
    readonly name: FieldPath<TFormValue>;
    readonly renderContext?: TRenderContext;
}

export function SchemaFormField<TFormValue extends FieldValues = FieldValues, TRenderContext extends RenderContext = RenderContext>({ name, renderContext }: SchemaFormFieldProps<TFormValue, TRenderContext>) {
    const { form, renderContext: formRenderContext } = useSchemaForm<TFormValue>();
    const formValues = form.getValues();

    const schema = useFieldSchema<TFormValue, TRenderContext>(name);

    const FieldComponent = useFieldComponent<any>(schema.type);

    const fieldStatus = useFieldStatus(schema as BaseFieldSchema, formValues);
    const fieldRenderContext = useMemo(
        () => Object.assign({}, formRenderContext, schema.renderContext, renderContext),
        [renderContext, schema.renderContext, formRenderContext]
    );

    if (!fieldStatus.isVisible) {
        return null;
    }

    const error = form.formState.errors[name] as FieldError | undefined;

    const commonProps: FieldWrapperProps<TFormValue, TRenderContext> = {
        form,
        name,
        error,
        schema,
        renderContext: fieldRenderContext,
        readOnly: fieldStatus.isReadOnly,
        disabled: fieldStatus.isDisabled
    };

    if (!schema.type) {
        const { Component } = schema as CustomFieldSchema<RenderContext, TFormValue>;

        return (
            <Component {...commonProps} />
        );
    }

    return (
        <FieldComponent {...commonProps} />
    );
}
