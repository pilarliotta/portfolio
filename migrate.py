
import re
import os

def extract_content(html, start_id, end_ids):
    start_index = html.find(f'id="{start_id}"')
    if start_index == -1:
        return ""
    
    # Find the next section or end of file
    end_index = len(html)
    for eid in end_ids:
        idx = html.find(f'id="{eid}"', start_index + 1)
        if idx != -1 and idx < end_index:
            end_index = idx
            
    return html[start_index:end_index]

def extract_project_data(html, project_id):
    section = extract_content(html, project_id, [
        'projectDiesel', 'projectReplicants', 'projectPerfection', 'projectTaragui',
        'projectGraphicDesign', 'projectWalsh', 'projectChastain', 'projectRockinrio',
        'projectPerception', 'projectAnderson', 'projectVsco', 'projectFacegenerator',
        'projectPersonalGallery', 'projectLostfound', 'projectExperimentalclock',
        'projectColorball', 'projectDataportrait', 'projectOpticalillusion',
        'projectExquisitecorpse', 'projectTouchDesigner', 'aboutPage', 'contactPage'
    ])
    
    if not section:
        return None
        
    data = {
        'id': project_id,
        'name': '',
        'category': '',
        'year': '',
        'role': '',
        'description': '',
        'reflection': '',
        'gallery': []
    }
    
    title_match = re.search(r'<h1>(.*?)</h1>', section)
    if title_match:
        data['name'] = title_match.group(1).strip()
        
    meta_items = re.findall(r'<div class="meta-item">.*?<div class="meta-label">(.*?)</div>.*?<div class="meta-value">(.*?)</div>', section, re.DOTALL)
    for label, value in meta_items:
        if 'Category' in label: data['category'] = value.strip()
        elif 'Year' in label: data['year'] = value.strip()
        elif 'Role' in label: data['role'] = value.strip()
        
    desc_match = re.search(r'<h1>.*?</h1>\s*<p>(.*?)</p>', section, re.DOTALL)
    if desc_match:
        data['description'] = desc_match.group(1).strip()
        
    reflection_match = re.search(r'<div class="project-reflection">.*?<p>(.*?)</p>', section, re.DOTALL)
    if reflection_match:
        data['reflection'] = reflection_match.group(1).strip()
        
    # Extract Gallery
    # Look for both img and video tags
    gallery_items = re.findall(r'<(img|video).*?(?:src|data-full|data-src)="(.*?)".*?>', section)
    for type, src in gallery_items:
        # Avoid duplicates and placeholder src
        if src and not src.startswith('data:') and src not in [g['src'] for g in data['gallery']]:
            # Try to find alt text
            alt_match = re.search(r'alt="(.*?)"', src) # This is wrong, re-searching in the whole tag
            tag_match = re.search(f'<{type}.*?{re.escape(src)}.*?>', section)
            alt = ""
            if tag_match:
                alt_res = re.search(r'alt="(.*?)"', tag_match.group(0))
                if alt_res: alt = alt_res.group(1)
            
            data['gallery'].append({'type': type, 'src': src, 'alt': alt})
            
    return data

# Load files
with open('/Users/pilarliotta/Desktop/liottaP Website/index.html', 'r') as f:
    old_html = f.read()

with open('/Users/pilarliotta/Downloads/pilar_portfolio_prototype.html', 'r') as f:
    proto_html = f.read()

project_ids = [
    'projectChastain', 'projectWalsh', 'projectRockinrio', 'projectReplicants',
    'projectPerception', 'projectDiesel', 'projectTaragui', 'projectGraphicDesign',
    'projectDataportrait', 'projectOpticalillusion', 'projectFacegenerator',
    'projectLostfound', 'projectExperimentalclock', 'projectColorball',
    'projectPersonalGallery', 'projectTouchDesigner', 'projectAnderson',
    'projectVsco', 'projectExquisitecorpse', 'projectPerfection'
]

projects = []
for pid in project_ids:
    pdata = extract_project_data(old_html, pid)
    if pdata:
        projects.append(pdata)

# Extract About and Contact
about_section = re.search(r'<div class="about-section">(.*?)</div>\s*</div>', old_html, re.DOTALL)
about_text = about_section.group(1).strip() if about_section else ""

skills_section = re.search(r'<div class="skills-chips".*?>(.*?)</div>', old_html, re.DOTALL)
skills_html = skills_section.group(1).strip() if skills_section else ""
# Convert chips to prototype format
skills = re.findall(r'<span class="chip".*?>(.*?)</span>', skills_html)
skills_tags = "\n".join([f'      <span class="skill-tag">{s}</span>' for s in skills])

# Featured work top 6
featured_ids = ['projectChastain', 'projectWalsh', 'projectRockinrio', 'projectReplicants', 'projectPerception', 'projectDiesel']
featured_projects = [p for p in projects if p['id'] in featured_ids]
# Sort them to match requested order
featured_projects.sort(key=lambda x: featured_ids.index(x['id']))

# 1. Update Navigation
# (Already good in prototype)

# 2. Update Featured Section
feat_html = ""
for i, p in enumerate(featured_projects):
    p_slug = p['id'].replace('project', '').lower()
    full_span = ' style="grid-column: 1 / -1; height: 280px;"' if p['id'] == 'projectPerception' else ''
    feat_html += f"""
    <!-- {p['name']} -->
    <div class="featured-item feat-{p_slug}"{full_span} onclick="openOverlay('{p_slug}')">
      <div class="featured-bg" style="background-image: url('{p['gallery'][0]['src'] if p['gallery'] else ''}'); background-size: cover; background-position: center;"></div>
      <div class="featured-overlay"></div>
      <div class="featured-info">
        <span class="featured-tag">{p['category']} · {p['year']}</span>
        <div class="featured-name">{p['name']}</div>
        <div class="featured-desc">{p['description'][:150]}...</div>
      </div>
      <div class="featured-arrow">→</div>
    </div>"""

# 3. Update All Projects Grid
grid_html = ""
for p in projects:
    p_slug = p['id'].replace('project', '').lower()
    grid_html += f"""
    <div class="project-card" onclick="openOverlay('{p_slug}')">
      <div class="project-card-bg" style="background-image: url('{p['gallery'][0]['src'] if p['gallery'] else ''}'); background-size: cover; background-position: center;"></div>
      <div class="project-card-overlay"></div>
      <div class="project-card-info">
        <div class="project-card-label">{p['category']} · {p['year']}</div>
        <div class="project-card-name">{p['name']}</div>
      </div>
    </div>"""

# 4. Update About Strip
# (We'll do a simple string replacement in the prototype)

# 5. Generate Overlays
overlays_html = ""
for p in projects:
    p_slug = p['id'].replace('project', '').lower()
    gallery_grid = ""
    for item in p['gallery'][1:6]: # first 5 more images
        if item['type'] == 'img':
            gallery_grid += f'<div class="overlay-grid-item"><img src="{item["src"]}" style="width:100%; height:100%; object-fit:cover;"><span>{item["alt"]}</span></div>\n'
        else:
            gallery_grid += f'<div class="overlay-grid-item"><video src="{item["src"]}" style="width:100%; height:100%; object-fit:cover;" muted loop autoplay></video><span>{item["alt"]}</span></div>\n'

    overlays_html += f"""
<div class="project-overlay" id="overlay-{p_slug}" role="dialog" aria-modal="true" aria-label="{p['name']}">
  <div class="overlay-nav">
    <button class="overlay-back" onclick="closeOverlay('{p_slug}')">Back to work</button>
    <span class="overlay-title-small">{p['name']}</span>
  </div>

  <div class="overlay-hero">
    <div class="overlay-hero-img">
      <div class="overlay-hero-img-inner">
        <img src="{p['gallery'][0]['src'] if p['gallery'] else ''}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div class="accent-bar"></div>
    </div>
    <div class="overlay-hero-content">
      <div>
        <div class="overlay-eyebrow">{p['category']} · {p['year']}</div>
        <h2 class="overlay-project-title">{p['name']}</h2>
        <p class="overlay-desc">{p['description']}</p>
      </div>
      <div class="overlay-meta-grid">
        <div>
          <div class="overlay-meta-label">Role</div>
          <div class="overlay-meta-val">{p['role']}</div>
        </div>
        <div>
          <div class="overlay-meta-label">Year</div>
          <div class="overlay-meta-val">{p['year']}</div>
        </div>
        <div>
          <div class="overlay-meta-label">Category</div>
          <div class="overlay-meta-val">{p['category']}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="overlay-gallery">
    <div class="overlay-gallery-title">Selected work</div>
    <div class="overlay-grid">
      {gallery_grid}
    </div>
  </div>

  <div class="overlay-reflection">
    <div>
      <h3 class="overlay-reflection-title">Reflection</h3>
    </div>
    <div>
      <p class="overlay-reflection-body">{p['reflection']}</p>
    </div>
  </div>
</div>
"""

# Assemble everything
new_html = proto_html

# Replace Featured Work
start_feat = new_html.find('<div class="featured-grid">') + len('<div class="featured-grid">')
end_feat = new_html.find('</div>', start_feat)
# Actually, the featured grid has many nested divs. Let's be careful.
# Find the end of featured-grid
depth = 1
i = start_feat
while depth > 0 and i < len(new_html):
    if new_html[i:i+4] == '<div': depth += 1
    elif new_html[i:i+5] == '</div': depth -= 1
    i += 1
end_feat = i - 6 # roughly

new_html = new_html[:start_feat] + feat_html + new_html[i-6:]

# Replace All Projects Grid
start_grid = new_html.find('<div class="projects-grid">') + len('<div class="projects-grid">')
# find matching end div
depth = 1
i = start_grid
while depth > 0 and i < len(new_html):
    if new_html[i:i+4] == '<div': depth += 1
    elif new_html[i:i+5] == '</div': depth -= 1
    i += 1
new_html = new_html[:start_grid] + grid_html + new_html[i-6:]

# Replace About Content
new_html = new_html.replace('<p class="about-body">Argentine American. Bilingual in English and Spanish. BFA Graphic Design + Photography, SCAD. MFA Design & Technology, Parsons. My practice moves between branding, editorial, interactive design, and creative code — always led by color, curiosity, and the spaces where visual systems meet human behavior.</p>', f'<p class="about-body">{about_text}</p>')
new_html = new_html.replace('<div class="skills-list">', '<div class="skills-list">\n' + skills_tags)

# Replace Overlays
# Remove existing overlay-chastain
overlay_start = new_html.find('<!-- CHASTAIN PROJECT OVERLAY -->')
overlay_end = new_html.find('<script>', overlay_start)
new_html = new_html[:overlay_start] + overlays_html + new_html[overlay_end:]

# Update section counts
new_html = new_html.replace('<span class="section-count">12 projects</span>', f'<span class="section-count">{len(projects)} projects</span>')

with open('/Users/pilarliotta/Desktop/liottaP Website/index_new.html', 'w') as f:
    f.write(new_html)
