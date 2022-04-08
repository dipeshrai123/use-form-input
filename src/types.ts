export type ErrorType<T> = {
  [key in keyof T]: { error: boolean; messages: Array<string> };
};

export type ValueType = object | [] | string | boolean | number;

export type ValidatorConfigType = {
  condition: boolean;
  message?: string;
  onMatch?: (messages?: string) => void;
};

export type ValidatorType<T> = (
  errors: any
) => (name: keyof T, config: ValidatorConfigType) => void;
