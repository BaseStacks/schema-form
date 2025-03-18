import { PropsWithChildren } from 'react';
import { memo } from 'react';

import { SchemaFormGlobalContext } from '../contexts';
import { SchemaFormGlobalContextType } from '../types';

function SchemaFormProviderImpl({ children, ...props }: PropsWithChildren<SchemaFormGlobalContextType>) {
    return (
        <SchemaFormGlobalContext.Provider value={props}>
            {children}
        </SchemaFormGlobalContext.Provider>
    );
};

export const SchemaFormProvider = memo(SchemaFormProviderImpl);
