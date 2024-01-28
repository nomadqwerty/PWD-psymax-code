import classNames, { Argument } from 'classnames';
import { extendTailwindMerge } from 'tailwind-merge';

export function cn(...inputs) {
  const twMerge = extendTailwindMerge({
    // We need to add our custom font utility classes to the default config so
    // that they will be merged and not stripped when used together with
    // example text-blue-900.
    classGroups: {
      'font-size': [{}],
    },
  });

  return twMerge(classNames(inputs));
}
