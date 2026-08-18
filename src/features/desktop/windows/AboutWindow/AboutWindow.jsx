import { useState } from "react";
import { personalInfo } from "../../../../data/personalInfo";
import { skills, skillCategories } from "../../../../data/skills";
import { currentFocus, engineeringInterests, aboutMyself } from "../../../../data/aboutSections";
import Icon from "../../../../components/Icon/Icon";

const AboutWindow = ({ windowId, onClose }) => {
  const [activeCategory, setActiveCategory] = useState("backend");

  const handleCategoryClick = (key) => {
    setActiveCategory(prev => prev === key ? null : key);
  };

  return (
    <div style={{ padding: '8px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{
            width: '96px',
            height: '96px',
            border: '2px inset #c0c0c0',
            borderRadius: '4px',
            overflow: 'hidden',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
             <img
              src="/assets/me.jpg"
              alt={personalInfo.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '8pt', maxWidth: '100px', wordWrap: 'break-word' }}>
            {personalInfo.name}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3 style={{ fontSize: '10pt', fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>
            {personalInfo.title}
          </h3>
          <p style={{ fontSize: '8pt', marginBottom: '8px', lineHeight: 1.5 }}>
            {personalInfo.company} &middot; {personalInfo.location}
          </p>
          <p style={{ fontSize: '8pt', marginBottom: '12px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
            {personalInfo.bio}
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <a href={personalInfo.links.github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000080', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '7pt' }}>
              <Icon name="github" size={32} />
              <span>GitHub</span>
            </a>
            <a href={personalInfo.links.linkedin} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000080', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '7pt' }}>
              <Icon name="linkedin" size={32} />
              <span>LinkedIn</span>
            </a>
            <a href={personalInfo.links.devto} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000080', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '7pt' }}>
              <Icon name="devto" size={32} />
              <span>Dev.to</span>
            </a>
            <a href={personalInfo.links.email} style={{ textDecoration: 'none', color: '#000080', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '7pt' }}>
              <Icon name="email" size={32} />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>

      <div className="win98-divider" style={{ marginBottom: '12px' }} />

      <h4 style={{ fontSize: '8pt', fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>
        Tech Stack
      </h4>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
          {skillCategories.map(category => (
            <button
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
              style={{
                padding: '4px 10px',
                background: '#c0c0c0',
                border: activeCategory === category.key ? '2px inset #c0c0c0' : '2px outset #c0c0c0',
                cursor: 'pointer',
                fontSize: '8pt',
                fontWeight: 'bold',
                color: '#000000',
                userSelect: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{category.label}</span>
              <Icon name="gear" size={12} />
            </button>
          ))}
        </div>

        {activeCategory && (
          <div style={{
            padding: '8px',
            border: '1px inset #c0c0c0',
            background: '#fff'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills
                .filter(s => s.category === activeCategory)
                .map(skill => (
                  <span
                    key={skill.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 8px',
                      background: '#e0e0e0',
                      border: '1px outset #c0c0c0',
                      borderRadius: '2px',
                      fontSize: '7pt',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <img
                      src={skill.image}
                      alt={skill.name}
                      width={16}
                      height={16}
                      style={{ marginRight: '4px', verticalAlign: 'middle' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {skill.name}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="win98-divider" style={{ marginTop: '16px', marginBottom: '12px' }} />

      <h4 style={{ fontSize: '9pt', fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>
        Current Focus
      </h4>
      <ul style={{ fontSize: '8pt', lineHeight: 1.8, paddingLeft: '16px', marginBottom: '16px' }}>
        {currentFocus.map((item, i) => <li key={i}>{item}</li>)}
      </ul>

      <h4 style={{ fontSize: '9pt', fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>
        Engineering Interests
      </h4>
      <ul style={{ fontSize: '8pt', lineHeight: 1.8, paddingLeft: '16px', marginBottom: '16px' }}>
        {engineeringInterests.map((item, i) => <li key={i}>{item}</li>)}
      </ul>

      <h4 style={{ fontSize: '9pt', fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>
        Some things about myself
      </h4>
      <ul style={{ fontSize: '8pt', lineHeight: 1.8, paddingLeft: '16px', marginBottom: '8px' }}>
        {aboutMyself.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item.text }} style={{ color: '#000' }} />
        ))}
      </ul>

    </div>
  );
};

export default AboutWindow;