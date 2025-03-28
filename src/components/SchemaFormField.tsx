import { FieldError, FieldPath, FieldValues } from 'react-hook-form';
import { BaseFieldSchema, RenderContext, SchemaFieldContextType } from '../types';
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

export function SchemaFormField<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
>({ name, renderContext }: SchemaFormFieldProps<TRenderContext, TFormValue>) {
    const { form, renderContext: formRenderContext } = useSchemaForm<TFormValue>();
    const formValues = form.getValues();

    const schema = useFieldSchema<TFormValue, TRenderContext>(name);
    const rules = useFieldRules(schema);

    const FieldComponent = useFieldComponent(schema);

    const fieldRenderContext = useMemo(
        () => Object.assign({}, formRenderContext, schema.renderContext, renderContext),
        [renderContext, schema.renderContext, formRenderContext]
    );

    const fieldStatus = useFieldStatus(schema as BaseFieldSchema, formValues);

    if (!fieldStatus.isVisible) {
        return null;
    }

    const error = form.formState.errors[name] as FieldError | undefined;

    const fieldContext: SchemaFieldContextType<TRenderContext, TFormValue> = {
        form,
        name,
        error,
        schema,
        rules,
        renderContext: fieldRenderContext
    };

    return (
        <SchemaFieldContext.Provider value={fieldContext}>
            <FieldComponent />
        </SchemaFieldContext.Provider>
    );
}
