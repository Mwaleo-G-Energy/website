export type SpecRow = { label: string; value: string };
export type ProductDetailCard = { title: string; description: string };

export type ParsedDescription = {
  introHtml: string;
  features: string[];
  featureCards: ProductDetailCard[];
  specs: SpecRow[];
  expansion: ProductDetailCard[];
  useCases: ProductDetailCard[];
  trailingHtml: string;
};

const ENTITIES: Record<string, string> = { nbsp: " ", quot: '"', apos: "'", lt: "<", gt: ">" };
const codePoint = (code: number, whole: string) => (code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole);

const toText = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, name: string) => {
      if (/^#x/i.test(name)) return codePoint(parseInt(name.slice(2), 16), whole);
      if (name.startsWith("#")) return codePoint(Number(name.slice(1)), whole);
      return name.toLowerCase() === "amp" ? whole : (ENTITIES[name.toLowerCase()] ?? whole);
    })
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();

const listAt = (html: string) => /^\s*<ul\b[^>]*>([\s\S]*?)<\/ul>/i.exec(html);
const listItems = (html: string) => Array.from(html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi), (match) => match[1]);
const textItems = (html: string) => listItems(html).map(toText).filter(Boolean);

const cardsOf = (html: string): ProductDetailCard[] =>
  listItems(html).map((item) => {
    const titleMatch = /<(?:strong|b)\b[^>]*>([\s\S]*?)<\/(?:strong|b)>/i.exec(item);
    if (titleMatch) {
      const title = toText(titleMatch[1]);
      const description = toText(item.replace(titleMatch[0], "").replace(/^\s*(?:[—–:-]\s*)?/, ""));
      return { title, description };
    }
    const text = toText(item);
    const split = /\s(?:—|–|:)\s/.exec(text);
    if (!split || split.index === undefined) return { title: text, description: "" };
    return { title: text.slice(0, split.index), description: text.slice(split.index + split[0].length) };
  }).filter((card) => card.title);

const sectionHeading = /<(h[2-6]|p)\b[^>]*>([\s\S]*?)<\/\1>/gi;
const headingName = (html: string) => toText(html).toLowerCase().replace(/[.:]/g, "").trim();
const headingsIn = (html: string) => Array.from(html.matchAll(sectionHeading)).filter((item) => {
  if (item[1].toLowerCase() !== "p") return true;
  return /<(?:strong|b)\b|font-weight\s*:\s*700/i.test(item[2]) ||
    ["specifications", "what sets it apart", "key features", "system expansion capability", "application scenarios", "use cases", "where it works"].includes(headingName(item[2]));
});
const cardsAfter = (html: string, heading: RegExpMatchArray | undefined) =>
  heading && heading.index !== undefined
    ? cardsOf(listAt(html.slice(heading.index + heading[0].length))?.[1] ?? "")
    : [];

/** Reads Wix description headings and lists into accessible product sections. Unknown sections stay as HTML. */
export function parseDescription(html: string): ParsedDescription | null {
  const headings = headingsIn(html);
  const specsHeading = headings.find((item) => headingName(item[2]) === "specifications");
  if (!specsHeading || specsHeading.index === undefined) return null;

  const specsStart = specsHeading.index + specsHeading[0].length;
  const specsList = listAt(html.slice(specsStart));
  if (!specsList) return null;
  const specs: SpecRow[] = [];
  for (const line of textItems(specsList[1])) {
    const colon = line.indexOf(":");
    if (colon < 1 || !line.slice(0, colon).trim() || !line.slice(colon + 1).trim()) return null;
    specs.push({ label: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim() });
  }
  if (!specs.length) return null;

  const beforeSpecs = html.slice(0, specsHeading.index);
  const precedingSections = headingsIn(beforeSpecs);
  const firstSectionStart = precedingSections.find((item) => ["what sets it apart", "key features"].includes(headingName(item[2])))?.index ?? specsHeading.index;
  const introHtml = beforeSpecs.slice(0, firstSectionStart).trim();
  const featureHeading = headings.find((item) => ["what sets it apart", "key features"].includes(headingName(item[2])));
  const featureCards = cardsAfter(html, featureHeading);
  const features = featureCards.map((card) => card.description ? `${card.title} — ${card.description}` : card.title);
  const expansionHeading = headings.find((item) => /expansion capability|system expansion/i.test(headingName(item[2])));
  const expansion = cardsAfter(html, expansionHeading);
  const casesHeading = headings.find((item) => /application scenarios|use cases|where it works/i.test(headingName(item[2])));
  const useCases = cardsAfter(html, casesHeading);

  let trailingHtml = html.slice(specsStart + specsList[0].length);
  for (const heading of [expansionHeading, casesHeading]) {
    if (!heading || heading.index === undefined) continue;
    const sectionStart = heading.index;
    const sectionEnd = heading.index + heading[0].length;
    const sectionList = listAt(html.slice(sectionEnd));
    if (sectionList) trailingHtml = trailingHtml.replace(html.slice(sectionStart, sectionEnd + sectionList[0].length), "");
  }
  trailingHtml = trailingHtml.trim();

  return { introHtml, features, featureCards, specs, expansion, useCases, trailingHtml };
}
