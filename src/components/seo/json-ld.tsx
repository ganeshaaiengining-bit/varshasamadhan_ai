/**
 * A schema.org block, written into the HTML the server already sends.
 *
 * Deliberately a server component with no state and no effect: structured data
 * that only appears after hydration is structured data Google may never see.
 *
 * `<` is escaped because the payload is JSON inside a `<script>` element. None
 * of the values here are user input today — they are the site's own name, its
 * paths and the owner's article titles — but an article title is written in the
 * admin panel and is the one place a `</script>` could close this element early.
 * Escaping it costs nothing and removes the question.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      // The string is JSON.stringify output with `<` escaped above.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
