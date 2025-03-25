import { Controller, FieldValues } from 'react-hook-form';
import { WithControllerProps, FieldHocProps, RenderContext, GenericFieldSchema } from '../../types';
import { useFieldRules } from '../../hooks/useFieldRules';
import { useMemo } from 'react';
import { getValidationStats } from '../../utils/fieldUtils';

interface WithControllerHocProps<TFormValue extends FieldValues, TRenderContext extends RenderContext> extends FieldHocProps<TRenderContext, TFormValue> {
}

export function withController<TRenderContext extends RenderContext = RenderContext>(
    Component: React.ComponentType<WithControllerProps<TRenderContext, any>>
) {
    return function ControllerFieldHoc<TFormValue extends FieldValues>({
        form,
        schema,
        name,
        error,
        renderContext
    }: WithControllerHocProps<TFormValue, TRenderContext>) {
        const genericSchema = schema as GenericFieldSchema<TRenderContext, TFormValue>;

        const { title, description, placeholder } = genericSchema;

        const rules = useFieldRules(form, name, genericSchema);
        const validationStats = useMemo(() => getValidationStats(rules), [rules]);

        return (
            <Controller
                name={name}
                control={form.control}
                rules={rules}
                shouldUnregister={genericSchema.shouldUnregister}
                defaultValue={genericSchema.value}
                render={(controller) => (
                    <Component
                        schema={schema}
                        field={controller.field}
                        fieldState={controller.fieldState}
                        formState={controller.formState}
                        name={name}
                        title={title}
                        description={description}
                        placeholder={placeholder}
                        renderContext={renderContext}
                        error={error}
                        required={validationStats.required}
                        min={validationStats.min}
                        max={validationStats.max}
                        minLength={validationStats.minLength}
                        maxLength={validationStats.maxLength}
                        pattern={validationStats.pattern}
                    />
                )}
            />
        );
    };
};

