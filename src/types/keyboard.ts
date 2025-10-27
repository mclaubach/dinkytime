import type { FunctionType } from './session';

export interface KeyEvent {
  key: string;
  code: string;
  timestamp: number;
}

export interface KeyMapping {
  key: string;
  functions: FunctionType[];
  params: Record<string, any>;
}

