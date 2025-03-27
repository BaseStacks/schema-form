import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { WithControllerProps, FieldHocProps, RenderContext, GenericFieldSchema } from '../../types';
import { useFieldRules } from '../../hooks/useFieldRules';
import { useMemo } from 'react';
import { getValidationStats } from '../../utils/fieldUtils';

interface WithControllerHocProps<TFormValue extends FieldValues, TRenderContext extends RenderContext> extends FieldHocProps<TRenderContext, TFormValue> {
}

export function withController<TRenderContext extends RenderContext = RenderContext>(
    Component: React.ComponentType<WithControllerProps<TRenderContext, any>>,
    baseRenderContext?: Partial<TRenderContext>,
    baseSchema?: RegisterOptions<any>
) {
    return function ControllerFieldHoc<TFormValue extends FieldValues>({
        form,
        schema,
        name,
        error,
        renderContext
    }: WithControllerHocProps<TFormValue, TRenderContext>) {
        const genericSchema = useMemo(() => ({
            ...baseSchema,
            ...schema
        } as GenericFieldSchema<TRenderContext, TFormValue>), [schema]);

        const { title, description, placeholder } = genericSchema;

        const rules = useFieldRules(genericSchema);
        const validationStats = useMemo(() => getValidationStats(rules), [rules]);

        const fieldRenderContext = useMemo(() => Object.assign({}, baseRenderContext, renderContext), [renderContext]);

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
                        renderContext={fieldRenderContext}
                        error={error}
                        required={!!validationStats?.required}
                        min={validationStats?.min}
                        max={validationStats?.max}
                        minLength={validationStats?.minLength}
                        maxLength={validationStats?.maxLength}
                        pattern={validationStats?.pattern}
                    />
                )}
            />
        );
    };
};

