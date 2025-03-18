import { createResolver } from '../resolverUtils';
import { FieldValues, ResolverOptions } from 'react-hook-form';

describe('resolverUtils', () => {
    describe('createResolver', () => {
        // Mock resolver and schema
        const mockResolverType = jest.fn().mockImplementation((schema) => {
            return jest.fn().mockReturnValue({ values: 'result' });
        });
        const mockSchema = { type: 'object', properties: {} };
        const mockOptions = {} as ResolverOptions<FieldValues>;
        const mockValues: FieldValues = { name: 'John' };
        const mockContext = {};

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return a resolver when resolverType and schema are provided', () => {
            const resolver = createResolver({
                resolverType: mockResolverType,
                schema: mockSchema
            });

            expect(resolver).toBeDefined();
            expect(mockResolverType).toHaveBeenCalledWith(mockSchema);

            // Test the resolver function works
            if (resolver) {
                const result = resolver(mockValues, mockContext, mockOptions);
                expect(result).toEqual({ values: 'result' });
            }
        });

        it('should handle createSchema when provided', () => {
            const mockCreateSchema = jest.fn().mockReturnValue(mockSchema);
            const resolver = createResolver({
                resolverType: mockResolverType,
                createSchema: mockCreateSchema
            });

            expect(resolver).toBeDefined();
            if (resolver) {
                resolver(mockValues, mockContext, mockOptions);
                expect(mockCreateSchema).toHaveBeenCalledWith(mockValues, mockContext, mockOptions);
            }
        });

        it('should return undefined when createSchema is provided but no resolverType', () => {
            const mockCreateSchema = jest.fn().mockReturnValue(mockSchema);
            const resolver = createResolver({
                resolverType: undefined as any,
                createSchema: mockCreateSchema
            });

            expect(resolver).toBeUndefined();
        });

        it('should return undefined when neither schema nor createSchema is provided', () => {
            const resolver = createResolver({
                resolverType: mockResolverType
            });

            expect(resolver).toBeUndefined();
        });
    });
});
