import {
    useCallback,
    useEffect,
    useMemo,
} from 'react';

import {
    FieldValues,
    FormProvider,
    SubmitHandler,
    useForm,
    UseFormProps,
} from 'react-hook-form';

import { SchemaFormContext } from '../contexts';
import { useGlobalContext } from '../hooks/useGlobalContext';
import {
    FormFields,
    RenderContext,
    SchemaFormContextType,
    SchemaFormRenderProps,
} from '../types';
import { SchemaFormField } from './SchemaFormField';

export type SchemaFormProps<TFormValue extends FieldValues = FieldValues, TRenderContext extends RenderContext = RenderContext> = UseFormProps<TFormValue> & {
    readonly id?: string;
    readonly fields: FormFields<TFormValue, TRenderContext>;
    readonly renderContext?: TRenderContext;
    readonly onSubmit?: SubmitHandler<TFormValue>;
    readonly children?: (innerProps: SchemaFormRenderProps<TRenderContext, TFormValue>) => React.ReactNode;
};

/**
 * A generic SchemaForm component that provides a flexible and extensible way to build forms
 * based on a schema definition. It integrates with React Hook Form for form state management
 * and supports custom rendering through a render context.
 *
 * @param props - {@link SchemaFormProps}.
 */
export function SchemaForm<TFormValue extends FieldValues = FieldValues, TRenderContext extends RenderContext = RenderContext>({
    id,
    fields,
    renderContext,
    children,
    onSubmit,
    ...formProps
}: SchemaFormProps<TFormValue, TRenderContext>) {
    const {
        components,
        renderContext: globalRenderContext,
        registerForm
    } = useGlobalContext();

    const form = useForm({
        ...formProps
    });

    const mergedRenderContext = useMemo(() => ({
        ...(globalRenderContext ?? {}),
        ...(renderContext ?? {}),
    } as TRenderContext), [globalRenderContext, renderContext]);

    const childrenElements = useMemo(() => {
        return Object.entries(fields).map(([fieldName]) => (
            <SchemaFormField key={fieldName} name={fieldName} />
        ));
    }, [fields]);

    const handleSubmit = useCallback((data: TFormValue, event?: React.BaseSyntheticEvent): unknown => {
        if (onSubmit) {
            return onSubmit(data, event);
        }
    }, [onSubmit]);

    const schemaForm: SchemaFormContextType<TRenderContext, TFormValue> = useMemo(() => ({
        form,
        fields,
        renderContext: mergedRenderContext,
    }), [form, fields, mergedRenderContext]);

    useEffect(() => {
        if (!id) {
            return;
        }

        const unregister = registerForm(
            id,
            {
                submit: form.handleSubmit(handleSubmit)
            }
        );

        return () => {
            unregister();
        };
    }, [id, form, form.formState, handleSubmit, registerForm]);

    const innerProps: SchemaFormRenderProps<TRenderContext, TFormValue> = {
        form,
        fields,
        onSubmit: handleSubmit,
        children: childrenElements,
        renderContext: mergedRenderContext
    };

    return (
        <SchemaFormContext.Provider value={schemaForm}>
            <FormProvider {...form}>
                {children ? children(innerProps) : <components.Form {...innerProps} />}
            </FormProvider>
        </SchemaFormContext.Provider>
    );
}
