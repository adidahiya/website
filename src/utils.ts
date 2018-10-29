// N.B. not sure why this file needs to exist here, but it does for gatsby to build

export function slugify(text: string) {
    return (
        text
            .toString()
            .toLowerCase()
            // Replace spaces with -
            .replace(/\s+/g, "-")
            // Remove all non-word chars
            .replace(/[^\w\-]+/g, "")
            // Replace multiple - with single -
            .replace(/\-\-+/g, "-")
            // Trim - from start of text
            .replace(/^-+/, "")
            // Trim - from end of text
            .replace(/-+$/, "")
    );
}
