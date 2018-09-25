declare module "gatsby" {
    const gatsby: any;
    export default gatsby;
    export function withPrefix(path: string): string;
    export function graphql(query: string): string;
}
