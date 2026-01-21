import { ReactNode } from 'react';

import { renderHook } from '@testing-library/react';

import { SchemaFormGlobalContext } from '../../contexts';
import { SchemaFormGlobalContextType } from '../../types';
import { useSubmit } from '../useSubmit';

describe('useSubmit', () => {
    const mockSubmit = jest.fn();
    const mockContextValue: SchemaFormGlobalContextType = {
        components: {
            Form: ({ children }) => <div>{children}</div>,
            fields: {
                string: () => <div>Text Field</div>,
            },
        },
        formMap: new Map([
            ['testForm', { submit: mockSubmit }],
            ['anotherForm', { submit: jest.fn() }],
        ]),
        registerForm: jest.fn(),
    };

    const Wrapper = ({ children }: { children: ReactNode }) => (
        <SchemaFormGlobalContext.Provider value={mockContextValue}>
            {children}
        </SchemaFormGlobalContext.Provider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the submit function for a registered form', () => {
        const { result } = renderHook(() => useSubmit('testForm'), { wrapper: Wrapper });

        expect(typeof result.current).toBe('function');
        
        // Call the returned function
        result.current();
        
        expect(mockSubmit).toHaveBeenCalledTimes(1);
    });

    it('should return the correct submit function for different form IDs', () => {
        const mockSubmit2 = jest.fn();
        mockContextValue.formMap.set('anotherForm', { submit: mockSubmit2 });

        const { result: result1 } = renderHook(() => useSubmit('testForm'), { wrapper: Wrapper });
        const { result: result2 } = renderHook(() => useSubmit('anotherForm'), { wrapper: Wrapper });

        result1.current();
        result2.current();

        expect(mockSubmit).toHaveBeenCalledTimes(1);
        expect(mockSubmit2).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when form ID is not registered', () => {
        const { result } = renderHook(() => useSubmit('nonExistentForm'), { wrapper: Wrapper });

        // Hook should not throw during rendering
        expect(typeof result.current).toBe('function');

        // Error should be thrown when calling the returned function
        expect(() => {
            result.current();
        }).toThrow('Form with ID "nonExistentForm" is not registered.');
    });

    it('should throw an error when used outside SchemaFormGlobalContext', () => {
        expect(() => {
            renderHook(() => useSubmit('testForm'));
        }).toThrow();
    });

    it('should work with dynamically added forms', () => {
        const newSubmit = jest.fn();
        mockContextValue.formMap.set('dynamicForm', { submit: newSubmit });

        const { result } = renderHook(() => useSubmit('dynamicForm'), { wrapper: Wrapper });

        result.current();

        expect(newSubmit).toHaveBeenCalledTimes(1);
    });

    it('should return a stable callback function', () => {
        const { result, rerender } = renderHook(() => useSubmit('testForm'), { wrapper: Wrapper });

        const firstCallback = result.current;
        rerender();
        const secondCallback = result.current;

        // The callback should be stable across re-renders
        expect(firstCallback).toBe(secondCallback);
    });

    it('should handle form registration changes', () => {
        const { result } = renderHook(() => useSubmit('lateRegisteredForm'), { wrapper: Wrapper });

        // Initially, form is not registered
        expect(() => {
            result.current();
        }).toThrow('Form with ID "lateRegisteredForm" is not registered.');

        // Register the form
        const newSubmit = jest.fn();
        mockContextValue.formMap.set('lateRegisteredForm', { submit: newSubmit });

        // Now it should work
        result.current();
        expect(newSubmit).toHaveBeenCalledTimes(1);
    });
});
