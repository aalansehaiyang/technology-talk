interface PermalinkOption {
    pattern: string;
    slug: string;
    date: string;
    regularPath: string;
    localePath: string;
}
declare const _default: ({ pattern, slug, date, regularPath, localePath }: PermalinkOption) => string | undefined;
export = _default;
