import { FieldArrayPath, FieldError, FieldPath, FieldValues, RegisterOptions, Resolver, ResolverOptions, SubmitHandler, UseFieldArrayProps, UseFieldArrayReturn, UseFormProps, UseFormRegisterReturn, UseFormReturn } from 'react-hook-form';

export type RenderProps = unknown;

export type ValidationSchema = unknown;

export type ResolverType<T extends FieldValues = FieldValues> = (schema: any, schemaOptions?: any, resolverOptions?: any) => Resolver<T>;

export type CreateValidationSchema<T extends FieldValues = FieldValues> = (values: T, context: RenderProps, options: ResolverOptions<T>) => ValidationSchema;

export type SelectOption<TValue = any, TContext = RenderProps> = TContext & {
    readonly value: TValue;
    readonly label: string;
};

export type JsonFormProps<TFormValue extends FieldValues = FieldValues, TContext = RenderProps> = UseFormProps<TFormValue> & {
    readonly schema?: ValidationSchema;
    readonly schemaOptions?: any;
    readonly resolverOptions?: any;
    readonly createSchema?: CreateValidationSchema<TFormValue>;
    readonly fields: FieldSchemas<TFormValue>;
    readonly onSubmit?: SubmitHandler<TFormValue>;
    readonly context?: TContext;
    readonly children?: (innerProps: JsonFormInnerProps<TContext, TFormValue>) => React.ReactNode;
};

export type JsonFormInnerProps<TContext = RenderProps, TFormValues extends FieldValues = FieldValues> = {
    readonly form: UseFormReturn<TFormValues>;
    readonly fields: FieldSchemas<TFormValues>;
    readonly onSubmit: SubmitHandler<TFormValues>;
    readonly defaultValues?: Partial<TFormValues>;
    readonly context?: TContext;
    readonly children: React.ReactNode;
};

export interface JsonFormComponents {
    /** Form component used to render the form */
    readonly Form: React.ComponentType<JsonFormInnerProps<RenderProps, GenericFieldProps>>;
    /** Map of field components by field type */
    readonly fields: {
        readonly [key: string]: React.ComponentType<GenericFieldProps<any> | ArrayFieldProps<any> | ObjectFieldProps<any>>;
    };
}

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

/**
 * Global context for the JSON form configuration
 */
export interface JsonFormGlobalContextType {
    /** Component overrides for form and fields */
    readonly components?: JsonFormComponents;
    /** Global render context */
    readonly renderContext?: RenderProps;
    /** Resolver type to use for schema validation */
    readonly validationResolver?: ResolverType<any>;
    /** Function to get default validation messages */
    readonly getDefaultMessages?: (validationStats: ValidationStats, field: BaseFieldSchema) => DefaultMessages;
}

/**
 * Context type for a specific JSON form instance
 */
export interface JsonFormContextType<TFormValues extends FieldValues = FieldValues> {
    /** Form control object */
    readonly form: UseFormReturn<TFormValues>;
    /** Field schema definitions */
    readonly fields: FieldSchemas;
    /** Render context */
    readonly context: unknown;
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
    TContext = RenderProps,
    TFormValues extends FieldValues = FieldValues
> = {
    // Field information
    readonly title?: string | null;
    readonly description?: string;
    readonly placeholder?: string;

    /** Field status */
    readonly visible?: ConditionedRule<TFormValues>;
    readonly readOnly?: ConditionedRule<TFormValues>;
    readonly disabled?: ConditionedRule<TFormValues>;

    // Context and component overrides
    readonly context?: TContext;
};

export type GenericFieldSchema<
    TContext = RenderProps,
    TFormValues extends FieldValues = FieldValues
> = RegisterOptions<TFormValues> & BaseFieldSchema<TContext, TFormValues> & FieldSchemaWithOption & FieldSchemaWithFormat & {
    readonly type: string;
};

export type CustomFieldSchema<
    TContext = RenderProps,
    TFormValues extends FieldValues = FieldValues
> = RegisterOptions<TFormValues> & BaseFieldSchema<TContext, TFormValues> & FieldSchemaWithOption & FieldSchemaWithFormat & {
    readonly type?: null;
    readonly Component: React.ComponentType<GenericFieldProps<TContext, TFormValues>>;
};

export type ArrayFieldSchema<
    TFieldValue extends FieldValues = FieldValues,
    TContext = RenderProps,
    TFormValues extends FieldValues = FieldValues,
> = BaseFieldSchema<TContext, TFormValues> & UseFieldArrayProps<TFormValues>['rules'] & {
    /** Field type */
    readonly type: 'array';
    /** Schema for individual items in the array */
    readonly items: ObjectFieldSchema<TFieldValue, TContext, TFormValues>;
    readonly uniqueItems?: true;
};

export type ObjectFieldProperties<
    TProperties extends FieldValues = FieldValues,
    TContext = RenderProps,
    TFormValues extends FieldValues = FieldValues,
> = {
        readonly [K in keyof TProperties]:
        | GenericFieldSchema<TContext, TFormValues>
        | ObjectFieldSchema<TProperties[K] extends FieldValues ? TProperties[K] : any, TContext, TFormValues>
        | ArrayFieldSchema<TProperties[K] extends FieldValues ? TProperties[K] : any, TContext, TFormValues>;
    };

export type ObjectFieldSchema<
    TFieldValue extends FieldValues = FieldValues,
    TContext = RenderProps,
    TFormValues extends FieldValues = FieldValues
> = BaseFieldSchema<TContext, TFormValues> & {
    readonly type: 'object';
    readonly properties: ObjectFieldProperties<TFieldValue>;
};

export type FieldSchemas<
    TFormValues extends FieldValues = FieldValues,
    TContext = RenderProps
> = {
        readonly [K in keyof TFormValues]:
        | CustomFieldSchema<TContext, TFormValues>
        | GenericFieldSchema<TContext, TFormValues>
        | ObjectFieldSchema<TFormValues[K] extends FieldValues ? TFormValues[K] : any, TContext, TFormValues>
        | ArrayFieldSchema<TFormValues[K] extends FieldValues ? TFormValues[K] : any, TContext, TFormValues>;
    };

export type BaseFieldProps<TContext> = {
    readonly name: string;
    readonly title?: string | null;
    readonly description?: string;
    readonly placeholder?: string;
    readonly required?: boolean;
    readonly readOnly?: boolean;
    readonly disabled?: boolean;
    readonly context: TContext;
    readonly error?: FieldError;
};

export type GenericFieldProps<
    TContext = RenderProps,
    TFormValues extends FieldValues = FieldValues
> = BaseFieldProps<TContext> & UseFormRegisterReturn<FieldPath<TFormValues>> & {
    // Field options
    readonly options?: SelectOption[];
};

export type ArrayFieldProps<
    TContext = unknown,
    TFieldValue extends FieldValues = FieldValues,
    TFormValues extends FieldValues = FieldValues,
    TFieldPath extends FieldArrayPath<TFormValues> = FieldArrayPath<TFormValues>,
    TFieldKey extends string = 'id',
> = BaseFieldProps<TContext>
    & {
        readonly field: ArrayFieldSchema<TFieldValue, TContext, TFormValues>;
        readonly array: UseFieldArrayReturn<TFormValues, TFieldPath, TFieldKey>;
        /** Whether items can be removed from the array */
        readonly canRemoveItem: boolean;
        /** Whether new items can be added to the array */
        readonly canAddItem: boolean;
        /** Function to render an array item at the given index */
        readonly renderItem: (index: number) => React.ReactNode;
    };

export type ObjectFieldProps<
    TContext = unknown,
    TFieldValue extends FieldValues = FieldValues,
    TFormValues extends FieldValues = FieldValues,
> = BaseFieldProps<TContext>
    & {
        readonly field: ObjectFieldSchema<TFieldValue, TContext, TFormValues>;
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

export interface FieldWrapperProps<
    TFormValues extends FieldValues,
    TContext = unknown,
> {
    readonly form: UseFormReturn<TFormValues>;
    readonly name: FieldPath<TFormValues>;
    readonly readOnly?: boolean;
    readonly disabled?: boolean;
    readonly validationStats?: ValidationStats;
    readonly error?: FieldError;
    readonly context?: TContext;
};
