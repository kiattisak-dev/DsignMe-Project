declare module 'daisyui';

declare module 'tailwindcss' {
  interface Config {
    daisyui?: {
      themes?: Array<
        | string
        | {
            [key: string]: {
              [key: string]: string;
            };
          }
      >;
    };
  }
}