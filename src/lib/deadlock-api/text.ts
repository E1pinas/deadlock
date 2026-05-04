export function formatNumber(value: number) {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  if (Math.abs(value) < 1) {
    return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  }

  return value.toFixed(1).replace(/\.0$/, "");
}

export function stripHtml(value?: string) {
  if (!value) {
    return "";
  }

  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function startCase(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function normalizeDisplayValue(
  value: string | number | undefined,
  postfix?: string,
  prefix?: string,
) {
  if (value === undefined || value === null) {
    return null;
  }

  const raw = String(value).trim();

  if (!raw || raw === "-1" || raw === "-1.0" || raw === "-2" || raw === "-2.0") {
    return null;
  }

  const numeric = Number.parseFloat(raw.replace(/[^\d.-]/g, ""));
  const hasNumeric = !Number.isNaN(numeric);

  if (hasNumeric && numeric === 0) {
    return null;
  }

  const cleanPrefix =
    prefix && !prefix.includes("{s:sign}") ? prefix.replace(/\{s:sign\}/g, "") : "";
  const needsPostfix = Boolean(postfix) && !raw.endsWith(postfix ?? "");

  return `${cleanPrefix}${raw}${needsPostfix ? postfix : ""}`;
}
