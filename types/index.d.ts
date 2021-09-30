declare module '*.svg' {
    const content: any;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.jpeg' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.less';

interface ExpededJest extends jest.Expect {
    <T = any>(actual: T, message: string): jest.Matchers<T>;
}
declare const expect: ExpededJest;
