import slugify from 'slugify';

/**
 * Generates a unique slug for a given name.
 * @param name The string to slugify.
 * @param isSlugTaken A function that checks if a slug exists (should return a Promise<boolean>).
 * @param baseSlug Optional base slug to use instead of slugifying the name again in suffixes.
 * @returns A unique slug string.
 */
export async function generateUniqueSlug(
  name: string,
  isSlugTaken: (slug: string) => Promise<boolean>,
  baseSlug?: string,
): Promise<string> {
  let slug = slugify(name, { lower: true, strict: true });
  if (baseSlug) slug = baseSlug;
  let uniqueSlug = slug;
  let suffix = 1;
  while (await isSlugTaken(uniqueSlug)) {
    uniqueSlug = `${slug}-${suffix}`;
    suffix++;
  }
  return uniqueSlug;
}
