import { FieldValues } from 'react-hook-form';
import { WithRegisterProps, FieldHocProps, RenderContext } from '../../types';
import { useMemo } from 'react';
import { useFieldRules } from '../../hooks/useFieldRules';

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
        const { title, description, placeholder } = schema;

        const rules = useFieldRules(form, name, schema);

        const register = useMemo(() => {
            return form.register(name, rules);
        }, [form, name]);

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
            />
        );
    };
};

