import { bookMap, meta, pages } from "./content";

const SOURCES: Record<string, [string, string]> = {
  "PCUSA G-4.0203": ["Presbyterian Church (U.S.A.), Book of Order G-4.0203, the trust clause", "https://pcusa.org/sites/default/files/advisory-opinion_19.pdf"],
  "PCUSA G-4.0207": ["Presbyterian Church (U.S.A.), Book of Order G-4.0207, severance of a congregation", "https://pcusa.org/sites/default/files/advisory-opinion_19.pdf"],
  "PCUSA councils": ["Presbyterian Church (U.S.A.), the four councils", "https://pcusa.org/sites/default/files/2024-10/councils_of_the_presbyterian_church.pdf"],
  "PCUSA assembly": ["Presbyterian Church (U.S.A.), make-up of the General Assembly", "https://www.presbyterianfoundation.org/event/226th-general-assembly/"],
  "OPC assembly": ["Orthodox Presbyterian Church, General Assembly", "https://mail.opc.org/ga.html"],
  "OPC standing rules": ["Orthodox Presbyterian Church, standing rules of the General Assembly", "https://www.opc.org/GA/Standing_Rules.pdf"],
  "History: PCA Historical Center": ["This Day in Presbyterian History, PCA Historical Center", "https://thisday.pcahistory.org/?p=11422"],
  "History: Presbyterian Historical Society": ["Documenting early Presbyterianism, Presbyterian Historical Society", "https://history.pcusa.org/node/5648"],
  "History: Presbyterian Outlook": ["The changing faces of American Presbyterianism, Presbyterian Outlook", "https://pres-outlook.org/?p=17089"],
  "History: PCA Confession preface": ["Preface to the PCA edition of the Confession and Catechisms", "https://www.pcaac.org/wp-content/uploads/2019/11/WCFPreface.pdf"],
  "History: First Assembly minutes": ["Minutes of the First General Assembly, 1973", "https://www.pcahistory.org/pca/ga/1st_pcaga_1973.pdf"],
  "History: pcanet.org": ["A brief history of the Presbyterian Church in America", "https://pcanet.org/history/"],
  "History: PCA statistics": ["PCA statistics, five-year summary through 2025", "https://www.pcaac.org/stats/"],
};

export type CiteInfo = { label: string; title: string; note: string; url: string };

const chapterTitle = (n: string) => bookMap.find((m) => String(m.ch) === n)?.t ?? "";

export function citeInfo(code: string): CiteInfo {
  const c = String(code);
  const src = SOURCES[c];
  if (src) return { label: c.replace(/^History: /, ""), title: src[0], note: "Checked in this source.", url: src[1] };
  if (/^WCF /.test(c)) return { label: c, title: `Westminster Confession of Faith ${c.slice(4)}, as adopted by the PCA`, note: "Quoted word for word. Public domain text.", url: meta.wcfPdf };
  if (/^LC /.test(c)) return { label: c, title: `Westminster Larger Catechism, question ${c.slice(3)}`, note: "Quoted word for word from the PCA edition.", url: meta.lcPdf };
  if (/^RAO /.test(c)) return { label: c, title: `Rules of Assembly Operations ${c.slice(4)}`, note: "The Assembly's operating rules, printed with the Book of Church Order but not part of the Constitution.", url: meta.bcoPdf };
  if (c === "BCO Appendices") return { label: c, title: "Appendices to the Book of Church Order", note: "No constitutional authority; printed for information.", url: meta.bcoPdf };

  const pref = c.match(/^BCO Pref\. (I|II|III)/);
  if (pref) {
    const p = pages.pref[pref[1]];
    return { label: c, title: `Preface, part ${pref[1]}`, note: p ? `Page ${p} of the official 2026 file.` : "", url: meta.bcoPdf + (p ? `#page=${p}` : "") };
  }
  const sec = c.match(/^BCO (\d{1,2})-(\d{1,3})/);
  if (sec) {
    const p = pages.sec[`${sec[1]}-${sec[2]}`] ?? pages.ch[sec[1]];
    return {
      label: c, title: `Chapter ${sec[1]}, ${chapterTitle(sec[1])}`,
      note: `${p ? `Page ${p} of the official 2026 file. ` : ""}Paraphrased here; the wording is not reproduced.`,
      url: meta.bcoPdf + (p ? `#page=${p}` : ""),
    };
  }
  const ch = c.match(/^BCO (\d{1,2})$/);
  if (ch) {
    const p = pages.ch[ch[1]];
    return { label: c, title: `Chapter ${ch[1]}, ${chapterTitle(ch[1])}`, note: p ? `Page ${p} of the official 2026 file.` : "", url: meta.bcoPdf + (p ? `#page=${p}` : "") };
  }
  return { label: c, title: c, note: "", url: meta.bcoPdf };
}
