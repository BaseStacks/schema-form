import { FieldError, FieldPath, FieldValues } from 'react-hook-form';
import { BaseFieldSchema, CustomFieldSchema, FieldHocProps, RenderContext } from '../types';
import { useFieldStatus } from '../hooks/useFieldStatus';
import { useFieldSchema } from '../hooks/useFieldSchema';
import { useSchemaForm } from '../hooks/useSchemaForm';
import { useMemo } from 'react';
import { useFieldComponent } from '../hooks/useFieldComponent';

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

    const commonProps: FieldHocProps<TRenderContext, TFormValue> = {
        form,
        name,
        error,
        schema,
        renderContext: fieldRenderContext
    };

    if (!schema.type) {
        const { Component } = schema as CustomFieldSchema<RenderContext, TFormValue>;

        return (
            <Component {...commonProps} />
        );
    }

    if(!FieldComponent) {
        throw new Error(`No field component found for type: ${schema.type}`);
    }

    return (
        <FieldComponent {...commonProps} />
    );
}
