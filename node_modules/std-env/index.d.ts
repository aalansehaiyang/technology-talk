declare const env: {
    readonly browser: boolean

    readonly test: boolean
    readonly dev: boolean
    readonly production: boolean
    readonly debug: boolean

    readonly ci: boolean
    readonly tty: boolean

    readonly minimal: boolean
    readonly minimalCLI: boolean

    readonly windows: boolean
    readonly darwin: boolean
    readonly linux: boolean
};

export default env;
