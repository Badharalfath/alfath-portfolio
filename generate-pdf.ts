import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import {
  contact,
  projects,
  skills,
  education,
  portfolioDocuments,
  credentials,
} from './lib/content';

// "Cinematic Paper" theme — soft warm cream base, muted terracotta / dusty
// slate / sage bands bleeding edge to edge, straight bold sans type.
const COLORS = {
  cream: '#F3ECE1',
  paper: '#FBF8F2',
  ink: '#2B2621',
  muted: '#645C50',
  clay: '#A85A34',
  slate: '#4C6071',
  sage: '#8EA07D',
  sand: '#E6DAC2',
  line: 'rgba(43, 38, 33, 0.18)',
} as const;

const toneStyles: Record<string, { bg: string; fg: string; border: string }> = {
  ink: { bg: COLORS.slate, fg: COLORS.paper, border: COLORS.slate },
  cobalt: { bg: COLORS.clay, fg: COLORS.paper, border: COLORS.clay },
  sunflower: { bg: COLORS.sage, fg: COLORS.ink, border: COLORS.sage },
  paper: { bg: COLORS.sand, fg: COLORS.ink, border: COLORS.ink },
};

async function fontDataUri(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  return `data:font/woff2;base64,${buffer.toString('base64')}`;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function buildHtml(): Promise<string> {
  const fontsDir = path.join(process.cwd(), 'app/fonts');
  const monoDir = path.join(
    process.cwd(),
    'node_modules/@fontsource/fragment-mono/files',
  );

  const [clashDisplay, switzer400, switzer500, switzer600, fragmentMono] = await Promise.all([
    fontDataUri(path.join(fontsDir, 'clash-display-600.woff2')),
    fontDataUri(path.join(fontsDir, 'switzer-400.woff2')),
    fontDataUri(path.join(fontsDir, 'switzer-500.woff2')),
    fontDataUri(path.join(fontsDir, 'switzer-600.woff2')),
    fontDataUri(path.join(monoDir, 'fragment-mono-latin-400-normal.woff2')),
  ]);

  const nonDiplomaDocuments = portfolioDocuments.filter((doc) => doc.category === 'credential');
  const diploma = education.find((entry) => entry.documentId);
  const diplomaDocument = diploma
    ? portfolioDocuments.find((doc) => doc.id === diploma.documentId)
    : undefined;

  const generatedOn = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const projectCards = projects
    .map((project, index) => {
      const tone = toneStyles[project.tone];
      const isLead = index === 0;
      return `
        <article class="project-card${isLead ? ' project-card--lead' : ''}" style="background:${tone.bg}; color:${tone.fg}; border-color:${tone.border};">
          <div class="project-card__body">
            <span class="eyebrow">Case #${project.number}</span>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.description)}</p>
          </div>
          <ul class="tag-row">
            ${project.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}
          </ul>
        </article>`;
    })
    .join('');

  const skillGroups = skills
    .map(
      (group, index) => `
        <div class="skill-group">
          <div class="skill-group__intro">
            <span class="eyebrow">0${index + 1}</span>
            <h3>${escapeHtml(group.group)}</h3>
            <p>${escapeHtml(group.description)}</p>
          </div>
          <ul class="tag-row tag-row--solid">
            ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>`,
    )
    .join('');

  const educationRows = education
    .map(
      (entry) => `
        <li>
          <span class="meta">${escapeHtml(entry.period)}</span>
          <div>
            <h4>${escapeHtml(entry.title)}</h4>
            <p>${escapeHtml(entry.detail)}</p>
          </div>
        </li>`,
    )
    .join('');

  const credentialRows = [
    ...(diploma && diplomaDocument
      ? [
          {
            title: diplomaDocument.title,
            issuer: diplomaDocument.issuer,
            issued: diplomaDocument.issued,
            identifier: `${diplomaDocument.identifierLabel}: ${diplomaDocument.identifier}`,
          },
        ]
      : []),
    ...nonDiplomaDocuments.map((doc) => ({
      title: doc.title,
      issuer: doc.issuer,
      issued: doc.issued,
      identifier: `${doc.identifierLabel}: ${doc.identifier}`,
    })),
  ]
    .map(
      (row) => `
        <li>
          <div class="credential-row__title">
            <h4>${escapeHtml(row.title)}</h4>
            <p>${escapeHtml(row.issuer)}</p>
          </div>
          <span class="meta credential-row__issued">${escapeHtml(row.issued)}</span>
          <span class="credential-row__id">${escapeHtml(row.identifier)}</span>
        </li>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Alfatihnaman Badharija Putra Madvi — Portfolio</title>
<style>
  @font-face {
    font-family: 'Clash Display';
    src: url('${clashDisplay}') format('woff2');
    font-weight: 600;
  }
  @font-face {
    font-family: 'Switzer';
    src: url('${switzer400}') format('woff2');
    font-weight: 400;
  }
  @font-face {
    font-family: 'Switzer';
    src: url('${switzer500}') format('woff2');
    font-weight: 500;
  }
  @font-face {
    font-family: 'Switzer';
    src: url('${switzer600}') format('woff2');
    font-weight: 600;
  }
  @font-face {
    font-family: 'Fragment Mono';
    src: url('${fragmentMono}') format('woff2');
    font-weight: 400;
  }

  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    background: ${COLORS.cream};
    color: ${COLORS.ink};
    font-family: 'Switzer', Arial, sans-serif;
    font-style: normal;
    font-size: 11px;
    line-height: 1.55;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  @page {
    size: A4;
    margin: 0;
  }

  .page {
    position: relative;
    background: ${COLORS.cream};
  }

  .page + .page {
    page-break-before: always;
  }

  h1, h2, h3, h4 {
    margin: 0;
    font-family: 'Clash Display', 'Arial Black', sans-serif;
    font-weight: 600;
    font-style: normal;
    letter-spacing: -0.02em;
  }

  p { margin: 0; }

  .eyebrow {
    display: inline-block;
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 8.5px;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .meta {
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 8.5px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  /* A bleed band spans the full page width, outside the inset column. */
  .band {
    width: 100%;
  }

  /* The inset column holds normal copy; left/right margins are deliberately
     uneven (editorial column) rather than a centered symmetric gutter. */
  .inset {
    padding: 0 12mm 0 18mm;
  }

  .rule {
    width: 100%;
    height: 1px;
    background: ${COLORS.line};
  }

  .rule--strong {
    height: 2px;
    background: ${COLORS.ink};
    opacity: 0.85;
  }

  /* ---------- Cover band ---------- */

  .hero-band {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 92mm;
    padding: 14mm 12mm 12mm 18mm;
    background: ${COLORS.clay};
    color: ${COLORS.paper};
  }

  .hero-band .eyebrow {
    color: ${COLORS.paper};
  }

  .hero-band__frame {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 18mm;
  }

  h1.hero-name {
    margin-top: 10px;
    font-size: 44px;
    line-height: 0.92;
    text-transform: uppercase;
    max-width: 130mm;
  }

  .hero-band__identity {
    text-align: right;
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 8.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${COLORS.sand};
    white-space: nowrap;
  }

  .hero-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 18mm;
    padding: 10mm 12mm 8mm 18mm;
  }

  .hero-summary {
    max-width: 88mm;
    font-size: 12px;
    line-height: 1.55;
  }

  .hero-summary strong {
    color: ${COLORS.clay};
    font-weight: 600;
  }

  .contact-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 8.5px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    text-align: right;
  }

  .contact-row span { border-bottom: 1px solid ${COLORS.ink}; padding-bottom: 2px; }

  .fact-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 10px 12mm 10px 18mm;
  }

  .fact-strip div {
    padding: 10px 16px 0 0;
  }

  .fact-strip div + div {
    padding-left: 16px;
    border-left: 1px solid ${COLORS.line};
  }

  .fact-strip dt { margin-bottom: 5px; color: ${COLORS.muted}; }
  .fact-strip dd { margin: 0; font-weight: 600; font-size: 11.5px; }

  /* ---------- Section heading ---------- */

  .section-heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 20px;
    margin-bottom: 18px;
  }

  .section-heading h2 { font-size: 26px; line-height: 0.95; }
  .section-heading p { max-width: 70mm; font-size: 10.5px; color: ${COLORS.muted}; }

  section { padding-top: 24px; }

  /* ---------- About ---------- */

  .about-layout {
    display: flex;
    gap: 20mm;
  }

  .about-copy { flex: 1.6; font-size: 11px; }
  .about-copy p + p { margin-top: 10px; }

  .about-timeline {
    flex: 1;
    margin: 0;
    padding: 0;
    list-style: none;
    border-left: 2px solid ${COLORS.clay};
  }

  .about-timeline li { padding: 0 0 14px 14px; }
  .about-timeline li:last-child { padding-bottom: 0; }
  .about-timeline .meta { color: ${COLORS.clay}; display: block; margin-bottom: 3px; }
  .about-timeline strong { display: block; font-size: 11.5px; font-weight: 600; }
  .about-timeline span.sub { color: ${COLORS.muted}; font-size: 10px; }

  /* ---------- Skills (full-bleed sage band) ---------- */

  .skills-band {
    padding: 22px 12mm 26px 18mm;
    background: ${COLORS.sand};
  }

  .skills-band .section-heading p { color: ${COLORS.ink}; opacity: 0.65; }

  .skill-group {
    display: flex;
    gap: 16mm;
    align-items: flex-start;
    padding: 14px 0;
    border-bottom: 1px solid ${COLORS.line};
    break-inside: avoid;
  }

  .skill-group:first-child { border-top: 1px solid ${COLORS.line}; }

  .skill-group__intro { flex: 0 0 48mm; }
  .skill-group__intro .eyebrow { color: ${COLORS.slate}; }
  .skill-group__intro h3 { font-size: 13px; margin-top: 4px; }
  .skill-group__intro p { font-size: 9.5px; color: ${COLORS.muted}; margin-top: 6px; }

  .tag-row {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin: 0;
    padding: 0;
    list-style: none;
    align-content: flex-start;
  }

  .tag-row--solid li {
    background: ${COLORS.paper};
    color: ${COLORS.ink};
    border: 1px solid ${COLORS.ink};
  }

  .tag-row li {
    padding: 5px 10px;
    border-radius: 999px;
    border: 1px solid currentColor;
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 8.5px;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  /* ---------- Projects (cinematic mosaic grid) ---------- */

  .project-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 10px;
  }

  .project-card {
    border: 1.5px solid;
    border-radius: 14px;
    padding: 16px;
    break-inside: avoid;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .project-card:nth-child(1) { grid-column: 1 / 13; grid-row: 1; }
  .project-card:nth-child(2) { grid-column: 1 / 8; grid-row: 2; }
  .project-card:nth-child(3) { grid-column: 8 / 13; grid-row: 2; }
  .project-card:nth-child(4) { grid-column: 1 / 5; grid-row: 3; }
  .project-card:nth-child(5) { grid-column: 5 / 9; grid-row: 3; }
  .project-card:nth-child(6) { grid-column: 9 / 13; grid-row: 3; }

  .project-card--lead {
    flex-direction: row;
    align-items: center;
    gap: 24px;
    min-height: 40mm;
  }

  .project-card--lead .project-card__body { flex: 1.5; }
  .project-card--lead .tag-row {
    flex: 1;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }

  .project-card:not(.project-card--lead) { min-height: 42mm; }

  .project-card h3 {
    font-size: 16px;
    line-height: 1.02;
    margin-top: 10px;
  }

  .project-card--lead h3 { font-size: 24px; }

  .project-card p {
    font-size: 10px;
    margin-top: 8px;
  }

  .project-card .tag-row { margin-top: 10px; gap: 5px; }
  .project-card .tag-row li {
    padding: 4px 8px;
    font-size: 7.5px;
  }

  /* ---------- Education & Credentials ---------- */

  .education-list {
    margin: 0 0 20px;
    padding: 0;
    list-style: none;
    border-top: 2px solid ${COLORS.ink};
  }

  .education-list li {
    display: flex;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid ${COLORS.line};
  }

  .education-list .meta { flex: 0 0 24mm; color: ${COLORS.slate}; }
  .education-list h4 { font-size: 13px; }
  .education-list p { font-size: 10px; margin-top: 3px; color: ${COLORS.muted}; }

  .credential-list {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 2px solid ${COLORS.ink};
  }

  .credential-list li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 11px 0;
    border-bottom: 1px solid ${COLORS.line};
  }

  .credential-row__title { flex: 1.4; }
  .credential-row__title h4 { font-size: 12px; font-weight: 600; font-family: 'Switzer', Arial, sans-serif; letter-spacing: 0; }
  .credential-row__title p { font-size: 9.5px; margin-top: 2px; color: ${COLORS.muted}; }
  .credential-row__issued { flex: 0 0 26mm; color: ${COLORS.muted}; }
  .credential-row__id {
    flex: 1;
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 8px;
    color: ${COLORS.muted};
    text-align: right;
  }

  /* ---------- Contact (closing band, full bleed) ---------- */

  .contact-band {
    margin-top: 26px;
    padding: 20mm 12mm 14mm 18mm;
    background: ${COLORS.slate};
    color: ${COLORS.paper};
  }

  .contact-band .eyebrow { color: ${COLORS.paper}; }
  .contact-band h2 { font-size: 34px; margin-top: 10px; text-transform: uppercase; line-height: 0.95; max-width: 140mm; }

  .contact-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 22px;
  }

  .contact-actions span {
    display: inline-flex;
    align-items: center;
    padding: 9px 16px;
    border: 1.5px solid ${COLORS.paper};
    border-radius: 999px;
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 9px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .contact-actions span.filled { background: ${COLORS.clay}; border-color: ${COLORS.clay}; color: ${COLORS.paper}; }

  .contact-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    padding-top: 14px;
    border-top: 1px solid rgba(251, 248, 242, 0.4);
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 8px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
</style>
</head>
<body>

  <div class="page">
    <div class="hero-band">
      <span class="eyebrow">Fresh graduate · Junior web developer</span>
      <div class="hero-band__frame">
        <h1 class="hero-name">Hi, I'm Alfatih. Web developer.</h1>
        <div class="hero-band__identity">
          Alfatihnaman<br />Badharija Putra Madvi<br /><br />Bandung,<br />Indonesia
        </div>
      </div>
    </div>

    <div class="rule rule--strong"></div>

    <div class="hero-summary-row">
      <p class="hero-summary">I'm a fresh <strong>Informatics Engineering graduate</strong> who enjoys building straightforward web apps and learning how each part works.</p>
      <div class="contact-row">
        <span>${escapeHtml(contact.email)}</span>
        <span>${escapeHtml(contact.github.replace('https://', ''))}</span>
        <span>${escapeHtml(contact.linkedin.replace('https://www.', ''))}</span>
      </div>
    </div>

    <div class="rule"></div>

    <dl class="fact-strip">
      <div><dt class="meta">Current stage</dt><dd>Fresh graduate</dd></div>
      <div><dt class="meta">What I build</dt><dd>Web apps and interfaces</dd></div>
      <div><dt class="meta">How I work</dt><dd>Learn, build, improve</dd></div>
    </dl>

    <div class="rule"></div>

    <div class="inset">
      <section>
        <div class="section-heading">
          <h2>A little about me.</h2>
        </div>
        <div class="about-layout">
          <div class="about-copy">
            <p>I recently graduated in Informatics Engineering from UNIKOM. I started learning software development in SMK Medikacom, then kept building small projects through college and my internship.</p>
            <p>I'm comfortable working with front-end code, databases, APIs, and the basic flow behind a web application. I'm still early in my career, and I like learning by building and improving things one step at a time.</p>
          </div>
          <ul class="about-timeline">
            <li><span class="meta">2018–2021</span><strong>Vocational School</strong><span class="sub">SMK Medikacom</span></li>
            <li><span class="meta">2021–2026</span><strong>University</strong><span class="sub">UNIKOM</span></li>
            <li><span class="meta">2025</span><strong>Internship</strong><span class="sub">Web development practice</span></li>
          </ul>
        </div>
      </section>
    </div>

    <div class="skills-band" style="margin-top: 24px;">
      <div class="section-heading">
        <h2>What I work with.</h2>
        <p>I use these in coursework, personal projects, and internship work. Most comfortable with the web basics and keep improving through hands-on projects.</p>
      </div>
      ${skillGroups}
    </div>
  </div>

  <div class="page">
    <div class="inset" style="padding-top: 18mm;">
      <div class="section-heading">
        <h2>My projects.</h2>
        <p>Six projects from coursework, internship, and personal practice.</p>
      </div>
      <div class="project-grid">
        ${projectCards}
      </div>

      <section>
        <div class="section-heading">
          <h2>How I learned.</h2>
          <p>My education gave me the basics, and short courses helped me explore web development, networking, English, and cybersecurity.</p>
        </div>
        <ul class="education-list">
          ${educationRows}
        </ul>
      </section>
    </div>
  </div>

  <div class="page">
    <div class="inset" style="padding-top: 18mm;">
      <div class="section-heading">
        <h2 style="font-size: 26px;">Credentials</h2>
        <p>Education diploma plus five course and professional credentials.</p>
      </div>
      <ul class="credential-list">
        ${credentialRows}
      </ul>
    </div>

    <div class="contact-band">
      <span class="eyebrow">Want to talk about a junior role or a project?</span>
      <h2>Let's have a conversation.</h2>
      <div class="contact-actions">
        <span class="filled">${escapeHtml(contact.email)}</span>
        <span>${escapeHtml(contact.github.replace('https://', ''))}</span>
        <span>${escapeHtml(contact.linkedin.replace('https://www.', ''))}</span>
      </div>
      <div class="contact-footer">
        <span>Bandung, Indonesia</span>
        <span>Generated ${generatedOn}</span>
      </div>
    </div>
  </div>

</body>
</html>`;
}

async function generatePdf() {
  const outputDir = path.join(process.cwd(), 'pdf-output');
  await fs.mkdir(outputDir, { recursive: true });

  const html = await buildHtml();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const pdfPath = path.join(outputDir, 'portfolio.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log('✅ PDF generated successfully!');
  console.log(`📄 Output: ${pdfPath}`);
}

generatePdf().catch((err) => {
  console.error('❌ Failed to generate PDF:', err);
  process.exit(1);
});
