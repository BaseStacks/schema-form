import { ControllerFieldState, ControllerRenderProps, FieldArrayPath, FieldError, FieldPath, FieldValues, RegisterOptions, Resolver, ResolverOptions, SubmitHandler, UseFieldArrayReturn, UseFormRegisterReturn, UseFormReturn, UseFormStateReturn } from 'react-hook-form';

export type RenderContext = any;

export type ValidationSchema = unknown;

export type ResolverType<T extends FieldValues = FieldValues> = (schema: any, schemaOptions?: any, resolverOptions?: any) => Resolver<T>;

export type CreateValidationSchema<T extends FieldValues = FieldValues> = (values: T, renderContext: RenderContext, options: ResolverOptions<T>) => ValidationSchema;

export type SelectOption<TValue = any, TRenderContext = Record<string, any>> = TRenderContext & {
    readonly value: TValue;
    readonly label: string;
};

export type SchemaFormRenderProps<TRenderContext extends RenderContext = RenderContext, TFormValue extends FieldValues = FieldValues> = {
    readonly form: UseFormReturn<TFormValue>;
    readonly fields: FieldSchemas<TFormValue>;
    readonly onSubmit: SubmitHandler<TFormValue>;
    readonly renderContext: TRenderContext;
    readonly children: React.ReactNode;
};

export interface ValidationStats {
    readonly required?: boolean;
    readonly minLength?: number;
    readonly maxLength?: number;
    readonly pattern?: string;
    readonly min?: number;
    readonly max?: number;
}

export type Message = string | React.ReactNode;

export type DefaultMessages = {
    readonly required?: Message;
    readonly minLength?: Message;
    readonly maxLength?: Message;
    readonly pattern?: Message;
    readonly min?: Message;
    readonly max?: Message;
};

export interface SchemaFormComponents<TRenderContext extends RenderContext = RenderContext> {
    /** Form component used to render the form */
    readonly Form: React.ComponentType<SchemaFormRenderProps<TRenderContext>>;
    /** Map of field components by field type */
    readonly fields: {
        readonly [key: string]: React.ComponentType<FieldHocProps<TRenderContext, any>>;
    };
}

/**
 * Global context for the JSON form configuration
 */
export interface SchemaFormGlobalContextType {
    /** Component overrides for form and fields */
    readonly components?: SchemaFormComponents;
    /** Global render context */
    readonly renderContext?: RenderContext;
    /** Resolver type to use for schema validation */
    readonly validationResolver?: ResolverType<any>;
    /** Function to get default validation messages */
    readonly getDefaultMessages?: (validationStats: ValidationStats, options: RegisterOptions<any>) => DefaultMessages;
}

/**
 * Context type for a specific JSON form instance
 */
export interface SchemaFormContextType<TFormValue extends FieldValues = FieldValues> {
    /** Form control object */
    readonly form: UseFormReturn<TFormValue>;
    /** Field schema definitions */
    readonly fields: FieldSchemas;
    /** Render context */
    readonly renderContext: unknown;
}

/**
 * Schema extension for fields with select options
 */
export interface FieldSchemaWithOption {
    /** Available options for selection */
    readonly options?: SelectOption[];
}

export interface FieldSchemaWithFormat {
    readonly format?: string;
};

export type BaseFieldSchema<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
> = RegisterOptions<TFormValue> & {
    readonly type?: string;
    // Field information
    readonly title?: string | null;
    readonly description?: string;
    readonly placeholder?: string;

    /** Field status */
    readonly visible?: ConditionedRule<TFormValue>;

    // Context and component overrides
    readonly renderContext?: TRenderContext;
};

export type GenericFieldSchema<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
> = BaseFieldSchema<TRenderContext, TFormValue> & FieldSchemaWithOption & FieldSchemaWithFormat & {
};

export type CustomFieldSchema<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
> = Omit<BaseFieldSchema<TRenderContext, TFormValue>, 'type'> & FieldSchemaWithOption & FieldSchemaWithFormat & {
    readonly type?: undefined;
    readonly Component: React.ComponentType<any>;
};

export type ArrayFieldSchema<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
    TFieldValue extends FieldValues[] = FieldValues[]
> = BaseFieldSchema<TRenderContext, TFormValue> & {
    /** Schema for individual items in the array */
    readonly items: ObjectFieldSchema<TFieldValue[0], TRenderContext, TFormValue>;
};

export type ObjectFieldSchema<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues,
    TProperties extends FieldValues = FieldValues
> = BaseFieldSchema<TRenderContext, TFormValue> & {
    readonly properties: ObjectFieldProperties<TRenderContext, TProperties>;
};

export type ObjectFieldProperties<
    TRenderContext extends RenderContext = RenderContext,
    TProperties extends FieldValues = FieldValues
> = {
        readonly [K in keyof TProperties]:
        | CustomFieldSchema<TRenderContext, TProperties>
        | GenericFieldSchema<TRenderContext, TProperties>
        | ObjectFieldSchema<TRenderContext, TProperties, TProperties[K] extends FieldValues ? TProperties[K] : any>
        | ArrayFieldSchema<TProperties, TRenderContext, TProperties[K] extends FieldValues ? TProperties[K] : any>;
    };

export type FieldSchemas<
    TFormValue extends FieldValues = FieldValues,
    TRenderContext extends RenderContext = RenderContext,
> = {
        readonly [K in keyof TFormValue]:
        | CustomFieldSchema<TRenderContext, TFormValue>
        | GenericFieldSchema<TRenderContext, TFormValue>
        | ObjectFieldSchema<TRenderContext, TFormValue, TFormValue[K] extends FieldValues ? TFormValue[K] : any>
        | ArrayFieldSchema<TFormValue, TRenderContext, TFormValue[K] extends FieldValues ? TFormValue[K] : any>;
    };

export interface BaseFieldProps<
    TRenderContext extends RenderContext = RenderContext
> {
    readonly name: string;
    readonly title?: string | null;
    readonly description?: string;
    readonly placeholder?: string;
    readonly required?: boolean;
    readonly readOnly?: boolean;
    readonly disabled?: boolean;
    readonly renderContext: TRenderContext;
    readonly error?: FieldError;
};

export type GenericFieldProps<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
> = BaseFieldProps<TRenderContext> & UseFormRegisterReturn<FieldPath<TFormValue>> & {
    // Field options
};

export type FieldWithRegisterProps<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
> = BaseFieldProps<TRenderContext> & {
    readonly register: UseFormRegisterReturn<FieldPath<TFormValue>>;
};

export type FieldWithControllerProps<
    TRenderContext extends RenderContext = RenderContext,
    TFormValue extends FieldValues = FieldValues
> = BaseFieldProps<TRenderContext> & {
    readonly field: ControllerRenderProps<TFormValue>;
    readonly fieldState: ControllerFieldState;
    readonly formState: UseFormStateReturn<TFormValue>;
};

export type FieldWithArrayProps<
    TRenderContext extends RenderContext = RenderContext,
    TFieldValue extends FieldValues = FieldValues,
    TFormValue extends FieldValues = FieldValues,
    TFieldPath extends FieldArrayPath<TFormValue> = FieldArrayPath<TFormValue>,
    TFieldKey extends string = 'id',
> = BaseFieldProps<TRenderContext>
    & {
        readonly schema: ArrayFieldSchema<TRenderContext, TFormValue, TFieldValue[]>;
        readonly array: UseFieldArrayReturn<TFormValue, TFieldPath, TFieldKey>;
        /** Whether items can be removed from the array */
        readonly canRemoveItem: boolean;
        /** Whether new items can be added to the array */
        readonly canAddItem: boolean;
        /** Function to render an array item at the given index */
        readonly renderItem: (index: number) => React.ReactNode;
    };

export type FieldWithObjectProps<
    TRenderContext extends RenderContext = RenderContext,
    TFieldValue extends FieldValues = FieldValues,
    TFormValue extends FieldValues = FieldValues,
> = BaseFieldProps<TRenderContext>
    & {
        readonly schema: ObjectFieldSchema<TRenderContext, TFormValue, TFieldValue>;
        /** Child elements to render within the object field */
        readonly children: React.ReactNode;
    };

/**
 * Condition for when a field should be displayed
 */
export type ConditionedRule<T extends FieldValues = FieldValues> =
    | ((formValues: T) => boolean)
    | boolean
    | string;

export interface FieldHocProps<
    TRenderContext extends RenderContext,
    TFormValue extends FieldValues,
    TFieldValues extends FieldValues = FieldValues
> {
    readonly form: UseFormReturn<TFormValue>;
    readonly schema: GenericFieldSchema<TRenderContext, TFormValue>
    | ArrayFieldSchema<TRenderContext, TFormValue, TFieldValues[]>
    | ObjectFieldSchema<TRenderContext, TFormValue, TFieldValues>;  
    readonly name: FieldPath<TFormValue>;
    readonly readOnly?: boolean;
    readonly disabled?: boolean;
    readonly validationStats?: ValidationStats;
    readonly error?: FieldError;
    readonly renderContext: TRenderContext;
};

