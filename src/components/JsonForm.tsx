import { useCallback, useMemo } from 'react';
import deepMerge from 'deepmerge';
import { FieldValues, FormProvider, useForm, useWatch } from 'react-hook-form';
import { JsonFormContextType, JsonFormInnerProps, JsonFormProps, RenderProps } from '../types';
import { JsonFormField } from './JsonFormField';
import { useGlobalContext } from '../hooks/useGlobalContext';
import { createResolver } from '../utils/resolverUtils';
import { JsonFormContext } from '../contexts';

/**
 * Main Schema Form component
 */
export function JsonForm<TFormValues extends FieldValues = FieldValues, TContext extends RenderProps = RenderProps>({
    schema,
    schemaOptions,
    createSchema,
    resolverOptions,
    fields,
    context: userContext,
    children,
    onSubmit,
    ...formProps
}: JsonFormProps<TFormValues, TContext>) {

    const { validationResolver: resolverType, components, renderContext: globalRenderContext, } = useGlobalContext();

    const resolver = useMemo(() => {
        if (formProps.resolver) {
            return formProps.resolver;
        }

        return createResolver<TFormValues>({
            resolverType,
            resolverOptions,
            schema,
            schemaOptions,
            createSchema
        });
    }, [formProps.resolver, resolverType, resolverOptions, schema, schemaOptions, createSchema]);

    // Initialize form with Ajv resolver for direct JSON Schema validation
    const form = useForm({
        ...formProps,
        resolver
    });

    useWatch({ control: form.control });

    const mergedContext = useMemo(() => deepMerge<TContext>((globalRenderContext ?? {}) as TContext, userContext ?? {}), [globalRenderContext, userContext]);

    const childrenElements = useMemo(() => {
        return Object.entries(fields).map(([fieldName]) => (
            <JsonFormField key={fieldName} name={fieldName} />
        ));
    }, [fields]);

    const handleSubmit = useCallback((data: TFormValues, event: React.BaseSyntheticEvent) => {
        if (onSubmit) {
            return onSubmit(data, event);
        }
    }, [onSubmit]);

    const innerProps: JsonFormInnerProps<TContext, any> = {
        form,
        fields,
        onSubmit: handleSubmit,
        defaultValues: formProps.defaultValues,
        children: childrenElements,
        context: mergedContext
    };

    const schemaForm: JsonFormContextType<TFormValues> = {
        form,
        fields,
        context: mergedContext,
    };

    return (
        <JsonFormContext.Provider value={schemaForm}>
            <FormProvider {...form}>
                {children ? children(innerProps) : <components.Form {...innerProps} />}
            </FormProvider>
        </JsonFormContext.Provider>
    );
}
