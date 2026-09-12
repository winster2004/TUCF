import { Injectable } from '@nestjs/common';

@Injectable()
export class PortfolioService {
  uploadResume(resume: { originalname?: string } | undefined) {
    return {
      resumeUrl: '',
      resumeFileName: resume?.originalname || 'resume.pdf',
    };
  }

  generate(payload: Record<string, unknown>) {
    const escapeHtml = (value: unknown) => String(value || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const safeUrl = (value: unknown) => {
      const url = String(value || '').trim();
      return /^(https?:\/\/|mailto:|data:|#|\/)/i.test(url) ? url : '#';
    };
    const array = (value: unknown): Record<string, unknown>[] => Array.isArray(value) ? value as Record<string, unknown>[] : [];
    const fullName = escapeHtml(payload.fullName || 'Developer Name');
    const title = escapeHtml(payload.title || 'Full Stack Developer');
    const tagline = escapeHtml(payload.tagline || 'Building modern digital experiences.');
    const bio = escapeHtml(payload.bio || 'Passionate developer building useful products.');
    const email = escapeHtml(payload.email || '');
    const location = escapeHtml(payload.location || '');
    const theme = ['midnight', 'cobalt', 'slate'].includes(String(payload.theme)) ? String(payload.theme) : 'midnight';
    const template = ['minimal', 'modern', 'split'].includes(String(payload.template)) ? String(payload.template) : 'modern';
    const skills = (Array.isArray(payload.skills) ? payload.skills : ['JavaScript', 'React', 'Node.js'])
      .map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join('');
    const experience = array(payload.experience).map((item) => `<article><h3>${escapeHtml(item.role)}</h3><p class="muted">${escapeHtml(item.company)} · ${escapeHtml(item.duration)}</p><p>${escapeHtml(item.description)}</p></article>`).join('') || '<article><h3>Experience</h3><p class="muted">Add your experience in the builder.</p></article>';
    const education = array(payload.education).map((item) => `<article><h3>${escapeHtml(item.degree)}</h3><p class="muted">${escapeHtml(item.college)} · ${escapeHtml(item.years)}</p></article>`).join('') || '<article><h3>Education</h3><p class="muted">Add your education in the builder.</p></article>';
    const projects = array(payload.projects).map((item) => {
      const tags = (Array.isArray(item.techTags) ? item.techTags : []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
      return `<article><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p><div class="tags">${tags}</div><a class="button secondary" href="${safeUrl(item.link)}" target="_blank" rel="noreferrer">View Project</a></article>`;
    }).join('') || '<article><h3>Featured Project</h3><p>Add your projects in the builder.</p></article>';
    const image = payload.profileImageUrl ? `<img class="profile-image" src="${safeUrl(payload.profileImageUrl)}" alt="${fullName}">` : `<div class="profile-placeholder">${fullName.charAt(0)}</div>`;
    const contactEmail = email ? `<a href="mailto:${email}">${email}</a>` : '';
    const contactLinks = [
      email ? `<a href="mailto:${email}">Email</a>` : '',
      payload.linkedin ? `<a href="${safeUrl(payload.linkedin)}" target="_blank" rel="noreferrer">LinkedIn</a>` : '',
      payload.github ? `<a href="${safeUrl(payload.github)}" target="_blank" rel="noreferrer">GitHub</a>` : '',
    ].filter(Boolean).join('');
    const splitLayoutStart = template === 'split'
      ? `<div class="portfolio-layout"><aside class="split-sidebar">${image}<h1>${fullName}</h1><p class="muted">${title}</p><div class="split-contact">${contactLinks}${location ? `<span>${location}</span>` : ''}</div><div class="tags">${skills}</div></aside><div class="portfolio-content">`
      : '';
    const splitLayoutEnd = template === 'split' ? '</div></div>' : '';
    const styles = `
      :root { --bg: ${theme === 'cobalt' ? '#071a3a' : theme === 'slate' ? '#172235' : '#080d1d'}; --surface: ${theme === 'cobalt' ? '#0d2a58' : theme === 'slate' ? '#243247' : '#111b35'}; --card: ${theme === 'cobalt' ? '#123b78' : theme === 'slate' ? '#2c3d53' : '#18264a'}; --text: #f8fafc; --muted: ${theme === 'cobalt' ? '#bfdbfe' : '#a9b8d0'}; --accent: ${theme === 'slate' ? '#c4b5fd' : '#60a5fa'}; --border: rgba(148,163,184,.25); }
      * { box-sizing: border-box; } body { margin: 0; color: var(--text); background: linear-gradient(140deg, var(--bg), var(--surface)); font: 16px/1.6 system-ui, sans-serif; } .container { width: min(1120px, 90vw); margin: auto; } section { padding: 64px 0; }
      .navbar-wrap { position: sticky; top: 0; background: color-mix(in srgb, var(--bg) 92%, transparent); border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); } .navbar { height: 72px; display: flex; align-items: center; justify-content: space-between; } .brand { font-weight: 800; font-size: 1.2rem; } .nav-links { display: flex; gap: 20px; } .nav-links a { color: var(--muted); text-decoration: none; }
      .hero-grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 48px; align-items: center; min-height: 60vh; } .hero-copy h1 { font-size: clamp(2.6rem, 7vw, 5.8rem); line-height: 1; margin: 8px 0; } .eyebrow { color: var(--accent); font-weight: 700; } .muted { color: var(--muted); } .hero-actions, .tags { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 22px; }
      .button { display: inline-block; border: 1px solid var(--border); border-radius: 10px; padding: 10px 16px; color: var(--text); text-decoration: none; background: var(--accent); } .button.secondary { background: transparent; } .profile-image, .profile-placeholder { width: min(320px, 80vw); aspect-ratio: 1; border-radius: 24px; object-fit: cover; border: 1px solid var(--border); } .profile-placeholder { display: grid; place-items: center; background: var(--card); font-size: 7rem; color: var(--accent); }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; } article { padding: 22px; border: 1px solid var(--border); border-radius: 16px; background: var(--card); margin-bottom: 18px; } article:hover { transform: translateY(-3px); border-color: var(--accent); } .tag { padding: 5px 10px; border-radius: 999px; background: color-mix(in srgb, var(--accent) 18%, transparent); font-size: .85rem; }
      .modern { background: radial-gradient(circle at 80% 0%, color-mix(in srgb, var(--accent) 25%, transparent), transparent 35%), linear-gradient(140deg, var(--bg), var(--surface)); } .modern article { transition: transform .2s, border-color .2s; box-shadow: 0 16px 40px rgba(0,0,0,.2); }
      .minimal { --bg: #ffffff; --surface: #ffffff; --card: #ffffff; --text: #172033; --muted: #667085; --accent: #172033; --border: #d9dee8; background: #fff; } .minimal .navbar-wrap { background: rgba(255,255,255,.92); } .minimal section { padding: 92px 0; } .minimal article { border-width: 1px; box-shadow: none; } .minimal .button { border-radius: 3px; background: var(--text); color: #fff; } .minimal .button.secondary { background: transparent; color: var(--text); }
      .split .portfolio-layout { display: grid; grid-template-columns: 280px minmax(0, 1fr); max-width: 1200px; margin: 0 auto; min-height: calc(100vh - 72px); } .split-sidebar { padding: 48px 28px; background: color-mix(in srgb, var(--surface) 75%, #000); border-right: 1px solid var(--border); } .split-sidebar .profile-image, .split-sidebar .profile-placeholder { width: 150px; font-size: 4rem; margin-bottom: 24px; } .split-sidebar h1 { font-size: 1.8rem; line-height: 1.1; } .split-contact { display: grid; gap: 8px; margin: 26px 0; } .split-contact a, .split-contact span { color: var(--muted); text-decoration: none; font-size: .9rem; } .split .portfolio-content { min-width: 0; padding: 0 42px; } .split .portfolio-content .hero-grid { min-height: 48vh; } .split .portfolio-content .hero-grid > div:last-child { display: none; } .split .portfolio-content .nav-links { display: none; }
      .contact-panel { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 24px; border: 1px solid var(--border); border-radius: 16px; background: var(--card); } footer { padding: 28px 0; border-top: 1px solid var(--border); color: var(--muted); }
      @media (max-width: 720px) { .nav-links { display: none; } .hero-grid, .grid { grid-template-columns: 1fr; } .split .portfolio-layout { display: block; } .split-sidebar { padding: 32px 5vw; border-right: 0; border-bottom: 1px solid var(--border); } .split-sidebar .profile-image, .split-sidebar .profile-placeholder { width: 100px; } .split .portfolio-content { padding: 0 5vw; } .contact-panel { display: grid; } }
    `;
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${fullName} | Portfolio</title><style>
${styles}</style></head><body class="${template}"><nav class="navbar-wrap"><div class="container navbar"><div class="brand">${fullName}</div><div class="nav-links"><a href="#hero">Home</a><a href="#experience-education">Experience</a><a href="#projects">Projects</a><a href="#contact">Contact</a></div></div></nav>${splitLayoutStart}<main>
<section id="hero"><div class="container hero-grid"><div class="hero-copy"><p class="eyebrow">${tagline}</p><h1>${fullName}</h1><h2>${title}</h2><p class="muted">${bio}</p><p class="muted">${location}</p><div class="hero-actions"><a class="button" href="#projects">${escapeHtml(payload.ctaPrimaryText || 'View Projects')}</a><a class="button secondary" href="${safeUrl(payload.resumeUrl)}" download>${escapeHtml(payload.ctaSecondaryText || 'Download Resume')}</a></div><div class="nav-links"><a href="${safeUrl(payload.github)}">GitHub</a><a href="${safeUrl(payload.linkedin)}">LinkedIn</a></div></div><div>${image}</div></div></section>
<section id="experience-education"><div class="container"><h2>Experience & Education</h2><div class="grid"><div>${experience}</div><div>${education}</div></div></div></section><section id="skills"><div class="container"><h2>Technical Arsenal</h2><div class="tags">${skills}</div></div></section><section id="projects"><div class="container"><h2>Featured Projects</h2><div class="grid">${projects}</div></div></section><section id="contact"><div class="container"><div class="contact-panel"><div><h2>Let’s Work Together</h2>${contactEmail ? `<p class="muted">${contactEmail}</p>` : ''}${location ? `<p class="muted">${location}</p>` : ''}</div><div class="hero-actions">${contactLinks}<a class="button" href="${safeUrl(payload.hireLink || (email ? `mailto:${email}` : '#'))}">Get in Touch</a></div></div></div></section></main>${splitLayoutEnd}<footer><div class="container">${fullName}${location ? ` · ${location}` : ''}</div></footer></body></html>`;
    const slug = fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'portfolio';
    return { html, theme, fileName: `${slug}-portfolio.html` };
  }
}
