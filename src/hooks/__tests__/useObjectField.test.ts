import { renderHook } from '@testing-library/react';
import { useObjectField } from '../useObjectField';
import { useFieldContext } from '../useFieldContext';
import { ObjectFieldSchema, RenderContext } from '../../types';

// Mock useFieldContext hook
jest.mock('../useFieldContext', () => ({
    useFieldContext: jest.fn(),
}));

describe('useObjectField hook', () => {
    // Default mock values
    const mockSchema: ObjectFieldSchema<any, any, any> = {
        type: 'object',
        title: 'Test Object',
        description: 'Test description',
        placeholder: 'Test placeholder',
        properties: {
            field1: { type: 'string' },
            field2: { type: 'number' },
        },
    };
    
    const mockName = 'testObject';
    const mockRenderContext = { mode: 'edit' } as RenderContext;

    beforeEach(() => {
        jest.clearAllMocks();
        (useFieldContext as jest.Mock).mockReturnValue({
            schema: mockSchema,
            name: mockName,
            renderContext: mockRenderContext,
        });
    });

    it('should return correct object properties', () => {
        const { result } = renderHook(() => useObjectField());
        
        expect(result.current).toEqual({
            schema: mockSchema,
            name: mockName,
            title: mockSchema.title,
            description: mockSchema.description,
            placeholder: mockSchema.placeholder,
            renderContext: mockRenderContext,
            fields: ['testObject.field1', 'testObject.field2'],
        });
    });

    it('should handle empty properties object', () => {
        (useFieldContext as jest.Mock).mockReturnValue({
            schema: { ...mockSchema, properties: {} },
            name: mockName,
            renderContext: mockRenderContext,
        });

        const { result } = renderHook(() => useObjectField());
        
        expect(result.current.fields).toEqual([]);
    });

    it('should handle undefined properties', () => {
        (useFieldContext as jest.Mock).mockReturnValue({
            schema: { ...mockSchema, properties: undefined },
            name: mockName,
            renderContext: mockRenderContext,
        });

        const { result } = renderHook(() => useObjectField());
        
        expect(result.current.fields).toEqual([]);
    });

    it('should derive fields from schema properties', () => {
        const customSchema = {
            ...mockSchema,
            properties: {
                name: { type: 'string' },
                age: { type: 'number' },
                address: { type: 'object' },
            },
        };

        (useFieldContext as jest.Mock).mockReturnValue({
            schema: customSchema,
            name: 'person',
            renderContext: mockRenderContext,
        });

        const { result } = renderHook(() => useObjectField());
        
        expect(result.current.fields).toEqual([
            'person.name',
            'person.age',
            'person.address',
        ]);
    });
});
