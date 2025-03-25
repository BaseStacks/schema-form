import { FieldValues } from 'react-hook-form';
import { WithRegisterProps, FieldHocProps, RenderContext, GenericFieldSchema } from '../../types';
import { useMemo } from 'react';
import { useFieldRules } from '../../hooks/useFieldRules';
import { getValidationStats } from '../../utils/fieldUtils';

interface WithRegisterHocProps<TRenderContext extends RenderContext, TFormValue extends FieldValues> extends FieldHocProps<TRenderContext, TFormValue> {
}

export function withRegister<TRenderContext extends RenderContext = RenderContext>(
    Component: React.ComponentType<WithRegisterProps<TRenderContext>>
) {
    return function WithRegisterHoc<TFormValue extends FieldValues>({
        form,
        schema,
        name,
        error,
        renderContext
    }: WithRegisterHocProps<TRenderContext, TFormValue>) {
        const genericSchema = schema as GenericFieldSchema<TRenderContext, TFormValue>;

        const { title, description, placeholder } = schema;

        const rules = useFieldRules(form, name, genericSchema);

        const register = useMemo(() => {
            return form.register(name, Object.assign(schema, rules));
        }, [form, name]);

        const validationStats = useMemo(() => getValidationStats(rules), [rules]);

        return (
            <Component
                schema={schema}
                register={register}
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
        );
    };
};

