import React from 'react';
import { SchemaFormContextType, SchemaFormGlobalContextType } from './types';

export const SchemaFormGlobalContext = React.createContext<SchemaFormGlobalContextType>(null!);

export const SchemaFormContext = React.createContext<SchemaFormContextType<any>>(null!);
