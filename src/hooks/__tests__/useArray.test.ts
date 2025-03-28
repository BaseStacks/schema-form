import { renderHook, act } from '@testing-library/react';
import { useArray } from '../useArray';
import { useFieldContext } from '../useFieldContext';
import { useFieldArray } from 'react-hook-form';

jest.mock('../useFieldContext');
jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    useFieldArray: jest.fn(),
}));

describe('useArray', () => {
    const mockUseFieldContext = useFieldContext as jest.Mock;
    const mockUseFieldArray = useFieldArray as jest.Mock;

    beforeEach(() => {
        mockUseFieldContext.mockReturnValue({
            schema: { title: 'Test Title', description: 'Test Description' },
            name: 'testArray',
            rules: { stats: { minLength: 1, maxLength: 3, required: true } },
            renderContext: {},
            error: null,
        });

        mockUseFieldArray.mockReturnValue({
            fields: [{ id: '1' }, { id: '2' }],
            append: jest.fn(),
            remove: jest.fn(),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the correct schema and metadata', () => {
        const { result } = renderHook(() => useArray());

        expect(result.current.schema.title).toBe('Test Title');
        expect(result.current.schema.description).toBe('Test Description');
        expect(result.current.name).toBe('testArray');
        expect(result.current.required).toBe(true);
        expect(result.current.minLength).toBe(1);
        expect(result.current.maxLength).toBe(3);
    });

    it('should determine if items can be added or removed', () => {
        const { result } = renderHook(() => useArray());

        expect(result.current.canAddItem).toBe(true); // maxLength is 3, fields.length is 2
        expect(result.current.canRemoveItem).toBe(true); // minLength is 1, fields.length is 2
    });

    it('should return the correct item name', () => {
        const { result } = renderHook(() => useArray());

        expect(result.current.getItemName(0)).toBe('testArray[0]');
        expect(result.current.getItemName(1)).toBe('testArray[1]');
    });

    it('should call append when adding an item', () => {
        const appendMock = jest.fn();
        mockUseFieldArray.mockReturnValue({
            fields: [{ id: '1' }, { id: '2' }],
            append: appendMock,
            remove: jest.fn(),
        });

        const { result } = renderHook(() => useArray());

        act(() => {
            result.current.array.append({ id: '3' });
        });

        expect(appendMock).toHaveBeenCalledWith({ id: '3' });
    });

    it('should call remove when removing an item', () => {
        const removeMock = jest.fn();
        mockUseFieldArray.mockReturnValue({
            fields: [{ id: '1' }, { id: '2' }],
            append: jest.fn(),
            remove: removeMock,
        });

        const { result } = renderHook(() => useArray());

        act(() => {
            result.current.array.remove(1);
        });

        expect(removeMock).toHaveBeenCalledWith(1);
    });

    it('should handle empty schema gracefully', () => {
        mockUseFieldContext.mockReturnValue({
            schema: {},
            name: 'testArray',
            rules: {},
            renderContext: {},
            error: null,
        });

        const { result } = renderHook(() => useArray());

        expect(result.current.schema.title).toBeUndefined();
        expect(result.current.schema.description).toBeUndefined();
        expect(result.current.required).toBeUndefined();
        expect(result.current.minLength).toBeUndefined();
        expect(result.current.maxLength).toBeUndefined();
    });
});
