// Standalone generator — separate from the web portfolio (lib/content.ts).
// Builds a print portfolio PDF for the Operator Warnet / IT Support CV,
// sourced from /Users/alfatih/Documents/CV_Alfatihnaman_Operator_Warnet.docx.
//
// To add the photo later: drop a file at one of PHOTO_CANDIDATES below
// (any name is fine as long as the extension matches) and rerun this script.
// Until then a labeled placeholder frame is rendered in its place.
import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const COLORS = {
  cream: '#EFEAE0',
  paper: '#F8F5EE',
  ink: '#2A2521',
  muted: '#89806F',
  gold: '#B9872F',
  line: 'rgba(42, 37, 33, 0.16)',
} as const;

const DOCS_DIR = '/Users/alfatih/Documents';
const PHOTO_CANDIDATES = [
  'alfatih-photo.jpg',
  'alfatih-photo.jpeg',
  'alfatih-photo.png',
].map((name) => path.join(DOCS_DIR, name));

const content = {
  name: 'Alfatihnaman',
  surname: 'Badharija Putra Madvi',
  role: 'Fresh Graduate Teknik Informatika — Hardware, Jaringan & IT Support',
  born: 'Lahir 22 Agustus 2003 · 23 Tahun',
  address: 'Komplek Pandanwangi Blok S No. 9A, Cijawura, Margacinta, Buah Batu, Bandung',
  phone: '0851-5698-5458',
  email: 'outlockalfath@gmail.com',
  github: 'github.com/Badharalfath',
  summary:
    'Fresh graduate Teknik Informatika UNIKOM dengan IPK 3.40, berdomisili di Bandung dengan pemahaman dasar hardware komputer, jaringan, dan troubleshooting. Pernah merakit komputer dari nol hingga instalasi Windows, serta menyelesaikan kursus Cisco Networking Academy, yaitu Introduction to Networks, Cybersecurity Essentials, dan Introduction to Cybersecurity. Berpengalaman bekerja dalam tim, teliti, disiplin, dan bersedia bekerja dengan sistem shift.',
  skills: [
    'Hardware & Software: merakit PC secara mandiri, mulai dari pemasangan komponen hingga instalasi Windows, serta troubleshooting dasar komputer',
    'Jaringan: dasar jaringan komputer dan koneksi internet melalui kursus Cisco Introduction to Networks',
    'Keamanan: dasar keamanan siber melalui kursus Cisco Cybersecurity Essentials dan Introduction to Cybersecurity',
    'Komunikasi & Kerja Tim: pengalaman proyek tim, serta kerja dalam tim TIK kampus',
    'Bahasa: Indonesia sebagai bahasa ibu, Inggris dengan TOEFL 550',
  ],
  education: [
    {
      period: 'September 2021 – Juni 2026',
      title: 'S1 Teknik Informatika, UNIKOM Bandung',
      detail: 'IPK 3.40 / 4.00 · Lulus mata kuliah Hardware: praktik merakit komputer dari awal sampai Windows terinstal',
    },
    {
      period: 'Lulus 2021',
      title: 'SMK Medikacom',
      detail: 'Jurusan Rekayasa Perangkat Lunak',
    },
  ],
  certifications: [
    'Cisco Networking Academy — Introduction to Networks',
    'Cisco Networking Academy — Cybersecurity Essentials',
    'Cisco Networking Academy — Introduction to Cybersecurity',
    'BNSP — Sertifikasi Kompetensi Junior Web Programmer',
    'TOEFL — Skor 550 (tes institusi kampus)',
    'Coding Camp — Intro to Software Engineer by RevoU',
  ],
  experience: {
    period: 'Agustus – Desember 2024',
    title: 'Programmer Magang, Tim TIK ISBI Bandung',
    detail:
      'Bekerja dalam tim TIK kampus, membangun website helpdesk dan manajemen aset untuk pelaporan kendala serta pelaporan pada bagian TIK.',
  },
  projects: [
    'Skripsi — Ekstensi browser Chromium Manifest V3 pendeteksi iklan judi online, dipublikasikan di Jurnal Komputa UNIKOM.',
    'Aplikasi Pemesanan Tiket Bioskop Online — proyek tim dengan Java, alur pemesanan end-to-end.',
    'Aplikasi Pemesanan & Smart Parking System — proyek tim, sistem pemesanan dan manajemen slot parkir digital.',
    'Dashboard Kepegawaian dan Website Text-to-Prompt / AI Image Generator.',
  ],
  stack: ['PHP', 'Laravel', 'JavaScript', 'Node.js', 'Tailwind CSS', 'Bootstrap', 'MySQL', 'Java', 'Python', 'Git/GitHub'],
};

async function fontDataUri(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  return `data:font/woff2;base64,${buffer.toString('base64')}`;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function findPhoto(): Promise<{ dataUri: string; mime: string } | null> {
  for (const candidate of PHOTO_CANDIDATES) {
    try {
      const buffer = await fs.readFile(candidate);
      const ext = path.extname(candidate).slice(1);
      const mime = ext === 'jpg' ? 'jpeg' : ext;
      return { dataUri: `data:image/${mime};base64,${buffer.toString('base64')}`, mime };
    } catch {
      // not found, try next candidate
    }
  }
  return null;
}

async function buildHtml(): Promise<string> {
  const fontsDir = path.join(process.cwd(), 'app/fonts');
  const monoDir = path.join(process.cwd(), 'node_modules/@fontsource/fragment-mono/files');

  const [clashDisplay, switzer400, switzer500, switzer600, fragmentMono, photo] = await Promise.all([
    fontDataUri(path.join(fontsDir, 'clash-display-600.woff2')),
    fontDataUri(path.join(fontsDir, 'switzer-400.woff2')),
    fontDataUri(path.join(fontsDir, 'switzer-500.woff2')),
    fontDataUri(path.join(fontsDir, 'switzer-600.woff2')),
    fontDataUri(path.join(monoDir, 'fragment-mono-latin-400-normal.woff2')),
    findPhoto(),
  ]);

  const generatedOn = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const skillItems = content.skills
    .map((entry) => {
      const [label, ...rest] = entry.split(': ');
      return `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(rest.join(': '))}</li>`;
    })
    .join('');

  const educationRows = content.education
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

  const certificationItems = content.certifications.map((c) => `<li>${escapeHtml(c)}</li>`).join('');
  const projectItems = content.projects.map((p) => `<li>${escapeHtml(p)}</li>`).join('');
  const stackChips = content.stack.map((s) => `<li>${escapeHtml(s)}</li>`).join('');

  const photoBlock = photo
    ? `<img src="${photo.dataUri}" alt="Foto ${escapeHtml(content.name)}" />`
    : `<div class="photo-placeholder">
         <span class="meta">Slot foto</span>
         <strong>${content.name
           .split(' ')
           .map((w) => w[0])
           .join('')}</strong>
         <span class="photo-placeholder__note">Foto akan ditambahkan di sini</span>
       </div>`;

  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Alfatihnaman Badharija Putra Madvi — Portofolio</title>
<style>
  @font-face { font-family: 'Clash Display'; src: url('${clashDisplay}') format('woff2'); font-weight: 600; }
  @font-face { font-family: 'Switzer'; src: url('${switzer400}') format('woff2'); font-weight: 400; }
  @font-face { font-family: 'Switzer'; src: url('${switzer500}') format('woff2'); font-weight: 500; }
  @font-face { font-family: 'Switzer'; src: url('${switzer600}') format('woff2'); font-weight: 600; }
  @font-face { font-family: 'Fragment Mono'; src: url('${fragmentMono}') format('woff2'); font-weight: 400; }

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
    font-variant-ligatures: none;
    font-feature-settings: "liga" 0, "clig" 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  @page { size: A4; margin: 0; }

  .page {
    position: relative;
    min-height: 297mm;
    padding: 18mm 16mm;
    background: ${COLORS.cream};
    overflow: hidden;
  }

  .page + .page { page-break-before: always; }

  /* Subtle paper grain — fractal noise tiled at low opacity. */
  .page::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.05;
    mix-blend-mode: multiply;
    pointer-events: none;
    background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  h1, h2, h3, h4 {
    margin: 0;
    font-family: 'Clash Display', 'Arial Black', sans-serif;
    font-weight: 600;
    font-style: normal;
    letter-spacing: -0.02em;
  }

  p { margin: 0; }
  ul { margin: 0; padding: 0; list-style: none; }

  .eyebrow {
    display: inline-block;
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 8.5px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .meta {
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 8px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${COLORS.muted};
  }

  .label-gold {
    font-size: 11px;
    color: ${COLORS.gold};
    margin-bottom: 10px;
  }

  .tag-arrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 13px;
    border: 1px solid ${COLORS.ink};
    border-radius: 999px;
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 8.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${COLORS.gold};
    white-space: nowrap;
  }

  /* ---------- Cover ---------- */

  .cover-top {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .cover-year {
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 9px;
    letter-spacing: 0.05em;
  }

  .cover-title {
    position: relative;
    z-index: 1;
    margin-top: 30mm;
  }

  .cover-title .word {
    display: block;
    font-size: 94px;
    line-height: 0.82;
    text-transform: uppercase;
  }

  .cover-title .word--folio { margin-left: 44mm; }

  .cover-badge {
    position: absolute;
    top: 34mm;
    left: 86mm;
    width: 34mm;
    height: 34mm;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4mm;
    border: 1.5px solid ${COLORS.ink};
    border-radius: 50%;
    background: ${COLORS.paper};
    transform: rotate(-9deg);
    text-align: center;
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 6.6px;
    letter-spacing: 0.08em;
    line-height: 1.5;
    text-transform: uppercase;
  }

  .cover-bottom {
    position: absolute;
    z-index: 1;
    left: 16mm;
    right: 16mm;
    bottom: 18mm;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 20mm;
    padding-top: 14px;
    border-top: 1px solid ${COLORS.line};
  }

  .cover-sub {
    max-width: 90mm;
    font-size: 11px;
    color: ${COLORS.muted};
  }

  /* ---------- Profile page ---------- */

  .profile-grid {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 16mm;
    align-items: flex-start;
  }

  .profile-photo { flex: 0 0 60mm; }

  .photo-frame img,
  .photo-placeholder {
    width: 60mm;
    height: 76mm;
    border-radius: 14px;
  }

  .photo-frame img {
    display: block;
    object-fit: cover;
  }

  .photo-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 1.5px dashed ${COLORS.ink};
    background: ${COLORS.paper};
    text-align: center;
    padding: 12px;
  }

  .photo-placeholder strong {
    font-size: 30px;
    color: ${COLORS.gold};
  }

  .photo-placeholder__note {
    max-width: 30mm;
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 7.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${COLORS.muted};
  }

  .profile-photo .meta { display: block; margin-top: 10px; text-align: center; }

  .profile-info { flex: 1; }

  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  .profile-header h2 { font-size: 34px; text-transform: uppercase; line-height: 0.95; }
  .profile-sub { margin-top: 6px; font-size: 12px; letter-spacing: 0.02em; color: ${COLORS.muted}; }

  .profile-summary {
    max-width: 120mm;
    margin-top: 18px;
    font-size: 11px;
  }

  .info-cols {
    display: flex;
    gap: 16mm;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid ${COLORS.line};
  }

  .info-cols > div { flex: 1; }
  .info-cols h4 { font-size: 10px; margin-bottom: 4px; }
  .info-cols p { font-size: 10px; color: ${COLORS.muted}; margin-bottom: 10px; }

  .education-mini { margin-bottom: 14px; }
  .education-mini:last-child { margin-bottom: 0; }

  .skills-block {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid ${COLORS.line};
  }

  .skills-block li {
    padding: 10px 0;
    border-bottom: 1px solid ${COLORS.line};
    font-size: 10.5px;
  }

  .skills-block li:last-child { border-bottom: none; }
  .skills-block strong { color: ${COLORS.ink}; }

  /* ---------- Mosaic page ---------- */

  .section-heading {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 20px;
    margin-bottom: 18px;
  }

  .section-heading h2 { font-size: 26px; }
  .section-heading p { max-width: 70mm; font-size: 10.5px; color: ${COLORS.muted}; }

  .mosaic-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 10px;
  }

  .tile {
    border-radius: 14px;
    padding: 16px;
    break-inside: avoid;
  }

  .tile--paper { background: ${COLORS.paper}; border: 1px solid ${COLORS.line}; }
  .tile--ink { background: ${COLORS.ink}; color: ${COLORS.paper}; }
  .tile--outline { background: transparent; border: 1.5px solid ${COLORS.gold}; }

  .tile h3 { font-size: 13px; margin-bottom: 10px; }
  .tile--ink h3 { color: ${COLORS.paper}; }
  .tile .meta { display: block; margin-bottom: 8px; }
  .tile--ink .meta { color: rgba(248, 245, 238, 0.55); }

  .tile ul li { font-size: 9.5px; padding: 5px 0 5px 12px; position: relative; }
  .tile ul li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 10px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${COLORS.gold};
  }

  .tile--stat { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
  .tile--stat strong { font-family: 'Clash Display', sans-serif; font-size: 46px; line-height: 0.9; color: ${COLORS.gold}; }
  .tile--stat span { margin-top: 8px; font-size: 9.5px; color: ${COLORS.muted}; }

  .tile--quote p { font-size: 13px; line-height: 1.4; font-weight: 600; }

  .chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip-row li {
    padding: 5px 10px;
    border-radius: 999px;
    border: 1px solid ${COLORS.ink};
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 8px;
  }
  .chip-row li::before { display: none; }

  .tile:nth-child(1) { grid-column: 1 / 5; grid-row: 1; }
  .tile:nth-child(2) { grid-column: 5 / 13; grid-row: 1; }
  .tile:nth-child(3) { grid-column: 1 / 7; grid-row: 2; }
  .tile:nth-child(4) { grid-column: 7 / 13; grid-row: 2; }
  .tile:nth-child(5) { grid-column: 1 / 8; grid-row: 3; }
  .tile:nth-child(6) { grid-column: 8 / 13; grid-row: 3; }

  .closing-row {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    margin-top: 28px;
    padding-top: 14px;
    border-top: 1px solid ${COLORS.line};
    font-family: 'Fragment Mono', 'Courier New', monospace;
    font-size: 8px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: ${COLORS.muted};
  }
</style>
</head>
<body>

  <div class="page">
    <div class="cover-top">
      <span class="eyebrow">IT Support · Jaringan · Hardware</span>
      <span class="cover-year">2026 ↗</span>
    </div>
    <div class="cover-title">
      <span class="word">Port</span>
      <span class="cover-badge">${escapeHtml(content.name)}<br />B.P.M.</span>
      <span class="word word--folio">folio</span>
    </div>
    <div class="cover-bottom">
      <span class="cover-sub">${escapeHtml(content.role)}</span>
      <span class="tag-arrow">Operator Warnet ↗</span>
    </div>
  </div>

  <div class="page">
    <div class="profile-grid">
      <div class="profile-photo">
        <div class="photo-frame">${photoBlock}</div>
        ${photo ? '' : ''}
        <span class="meta">${escapeHtml(content.born)}</span>
      </div>
      <div class="profile-info">
        <div class="profile-header">
          <div>
            <h2>${escapeHtml(content.name)}</h2>
            <p class="profile-sub">${escapeHtml(content.surname)}</p>
          </div>
          <span class="tag-arrow">Fresh Graduate ↗</span>
        </div>
        <p class="profile-summary">${escapeHtml(content.summary)}</p>

        <div class="info-cols">
          <div>
            <h4 class="label-gold">Pendidikan</h4>
            ${content.education
              .map(
                (e) => `
              <div class="education-mini">
                <span class="meta">${escapeHtml(e.period)}</span>
                <p style="color:${COLORS.ink}; font-weight:600; margin:3px 0 2px; font-size:10.5px;">${escapeHtml(e.title)}</p>
                <p>${escapeHtml(e.detail)}</p>
              </div>`,
              )
              .join('')}
          </div>
          <div>
            <h4 class="label-gold">Kontak</h4>
            <p>${escapeHtml(content.phone)}</p>
            <p>${escapeHtml(content.email)}</p>
            <p>${escapeHtml(content.github)}</p>
            <p>${escapeHtml(content.address)}</p>
            <h4 class="label-gold" style="margin-top: 14px;">Bahasa</h4>
            <p>Indonesia — Bahasa Ibu</p>
            <p>Inggris — TOEFL 550</p>
          </div>
        </div>

        <div class="skills-block">
          <h4 class="label-gold">Keahlian Relevan</h4>
          <ul>${skillItems}</ul>
        </div>
      </div>
    </div>
  </div>

  <div class="page">
    <div class="section-heading">
      <h2>Sertifikasi, Proyek &amp; Pengalaman</h2>
      <p>Ringkasan pelatihan, pengalaman kerja, dan proyek yang sudah diselesaikan.</p>
    </div>
    <div class="mosaic-grid">
      <div class="tile tile--outline tile--stat">
        <strong>3.40</strong>
        <span>IPK / 4.00 — UNIKOM</span>
      </div>
      <div class="tile tile--ink">
        <span class="meta">${escapeHtml(content.experience.period)}</span>
        <h3>${escapeHtml(content.experience.title)}</h3>
        <p style="font-size: 10px; line-height: 1.5;">${escapeHtml(content.experience.detail)}</p>
      </div>
      <div class="tile tile--paper">
        <h3>Proyek</h3>
        <ul>${projectItems}</ul>
      </div>
      <div class="tile tile--paper">
        <h3>Sertifikasi &amp; Pelatihan</h3>
        <ul>${certificationItems}</ul>
      </div>
      <div class="tile tile--paper">
        <h3>Keahlian Tambahan</h3>
        <ul class="chip-row">${stackChips}</ul>
      </div>
      <div class="tile tile--outline tile--quote">
        <p>“Teliti, disiplin, dan siap bekerja dengan sistem shift.”</p>
      </div>
    </div>

    <div class="closing-row">
      <span>Bandung, Indonesia</span>
      <span>Dibuat ${generatedOn}</span>
    </div>
  </div>

</body>
</html>`;
}

async function generatePdf() {
  const outputPath = path.join(DOCS_DIR, 'CV_Alfatihnaman_Operator_Warnet_Portfolio.pdf');
  const html = await buildHtml();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log('✅ PDF generated successfully!');
  console.log(`📄 Output: ${outputPath}`);
}

generatePdf().catch((err) => {
  console.error('❌ Failed to generate PDF:', err);
  process.exit(1);
});
