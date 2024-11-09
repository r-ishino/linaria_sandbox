export const isBlank = <T>(
  arg: T | null | undefined
): arg is null | undefined => {
  if (Array.isArray(arg)) {
    return arg.length === 0;
  }
  if (typeof arg === 'boolean') {
    return arg === false;
  }
  return arg === null || arg === undefined || arg === '';
};
