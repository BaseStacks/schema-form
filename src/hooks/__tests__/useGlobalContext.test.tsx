import {
    PropsWithChildren,
    ReactNode,
} from 'react';

import { renderHook } from '@testing-library/react';

import { SchemaFormGlobalContext } from '../../contexts';
import { SchemaFormGlobalContextType } from '../../types';
import { useGlobalContext } from '../useGlobalContext';

describe('useGlobalContext', () => {
    const mockContextValue: SchemaFormGlobalContextType = {
        components: {
            Form: ({ children }: PropsWithChildren) => <div>{children}</div>,
            fields: {
                string: () => <div>Text Field</div>,
            },
        },
        formMap: new Map(),
        registerForm: jest.fn(),
    };

    it('should return context value when used inside SchemaFormGlobalContext', () => {
        const Wrapper = ({ children }: { children: ReactNode; }) => (
            <SchemaFormGlobalContext.Provider value={mockContextValue}>
                {children}
            </SchemaFormGlobalContext.Provider>
        );

        const { result } = renderHook(() => useGlobalContext(), { wrapper: Wrapper });
        expect(result.current).toEqual(mockContextValue);
    });

    it('should throw error when used outside SchemaFormGlobalContext', () => {
        expect(() => {
            renderHook(() => useGlobalContext());
        }).toThrow();
    });
});
