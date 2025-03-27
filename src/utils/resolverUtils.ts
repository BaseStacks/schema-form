import { FieldValues, Resolver } from 'react-hook-form';
import { CreateValidationSchema, ResolverType, ValidationSchema } from '../types';

interface CreateResolverOptions<T extends FieldValues> {
    readonly resolverType?: ResolverType<T>;
    readonly resolverOptions?: any;
    readonly schema?: ValidationSchema;
    readonly schemaOptions?: any;
    readonly createSchema?: CreateValidationSchema<T>;
};

export const createResolver = <T extends FieldValues>({
    resolverType,
    resolverOptions,
    schema,
    schemaOptions,
    createSchema
}: CreateResolverOptions<T>): Resolver<T> | undefined => {
    if (!resolverType) {
        return undefined;
    }

    if (schema) {
        return resolverType(schema);
    }

    if (createSchema) {
        return (values, _, options) => {
            const createdSchema = createSchema(values, _, options);
            return resolverType(createdSchema, schemaOptions, resolverOptions)(values, _, options);
        };
    }
};
