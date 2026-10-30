import markdownIt from "markdown-it";

const md = markdownIt({ html: false, linkify: true, typographer: true });
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["SU","MO","TU","WE","TH","FR","SA"];

// "2026-11-21T19:00" -> parts, read literally (church time), never shifted by the build server's time zone
const parts = (s = "") => {
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
  return m ? { y: +m[1], mo: +m[2], d: +m[3], h: +(m[4] || 0), mi: +(m[5] || 0) } : null;
};
const pad = n => String(n).padStart(2, "0");
const stamp = p => `${p.y}${pad(p.mo)}${pad(p.d)}`;
const stampTime = p => `${stamp(p)}T${pad(p.h)}${pad(p.mi)}00`;
const addDays = (p, n) => { const t = new Date(Date.UTC(p.y, p.mo - 1, p.d + n, p.h, p.mi)); return { y: t.getUTCFullYear(), mo: t.getUTCMonth() + 1, d: t.getUTCDate(), h: t.getUTCHours(), mi: t.getUTCMinutes() }; };
const addHours = (p, n) => { const t = new Date(Date.UTC(p.y, p.mo - 1, p.d, p.h + n, p.mi)); return { y: t.getUTCFullYear(), mo: t.getUTCMonth() + 1, d: t.getUTCDate(), h: t.getUTCHours(), mi: t.getUTCMinutes() }; };

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets", "src/images": "images", "src/admin": "admin", "src/favicon.svg": "favicon.svg", "src/robots.txt": "robots.txt" });
  eleventyConfig.addWatchTarget("src/assets/");

  // *italic* and **bold** inside short CMS text fields
  eleventyConfig.addFilter("md", s => md.renderInline(String(s || "")));
  eleventyConfig.addFilter("day", s => { const p = parts(s); return p ? String(p.d) : ""; });
  eleventyConfig.addFilter("mon", s => { const p = parts(s); return p ? MONTHS[p.mo - 1] : ""; });
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("tel", s => "+1" + String(s || "").replace(/\D/g, "").replace(/^1/, ""));
  eleventyConfig.addFilter("mapsUrl", s => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(s || ""));
  eleventyConfig.addFilter("nbsp", s => String(s || "").replace(/@(\S+) (\S+)/g, "@$1 $2"));

  // Google Calendar "add event" link
  eleventyConfig.addFilter("gcal", (title, start, end, allDay, weekly, location) => {
    const s = parts(start); if (!s) return "#";
    let dates;
    if (allDay) dates = `${stamp(s)}/${stamp(addDays(s, 1))}`;
    else { const e = parts(end) || addHours(s, 2); dates = `${stampTime(s)}/${stampTime(e)}`; }
    const q = new URLSearchParams({ action: "TEMPLATE", text: title || "", dates, location: location || "" });
    if (!allDay) q.set("ctz", "America/New_York");
    if (weekly) q.set("recur", "RRULE:FREQ=WEEKLY;BYDAY=" + DAYS[new Date(Date.UTC(s.y, s.mo - 1, s.d)).getUTCDay()]);
    return "https://calendar.google.com/calendar/render?" + q.toString();
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk"
  };
}
