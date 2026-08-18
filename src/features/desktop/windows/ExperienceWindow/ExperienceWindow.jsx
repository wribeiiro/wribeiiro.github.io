import { experiences } from "../../../../data/experiences";

const ExperienceWindow = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0', overflow: 'hidden' }}>

      {/* Menu bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '18px',
        padding: '0 4px',
        background: '#c0c0c0',
        borderBottom: '1px solid #808080',
        flexShrink: 0,
      }}>
        {['File', 'Edit', 'View', 'Insert', 'Format', 'Help'].map(item => (
          <span
            key={item}
            style={{ padding: '0 6px', fontSize: '8pt', cursor: 'default', userSelect: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '28px',
        padding: '2px 4px',
        background: '#c0c0c0',
        borderBottom: '1px solid #808080',
        flexShrink: 0,
        gap: '4px',
      }}>
        {/* Font selector */}
        <select
          id="wp-font"
          defaultValue="Arial"
          onChange={(e) => document.execCommand('fontName', false, e.target.value)}
          style={{
            height: '20px',
            width: '130px',
            border: '2px inset #c0c0c0',
            background: '#fff',
            fontSize: '8pt',
            fontFamily: 'Arial, sans-serif',
            cursor: 'default',
            outline: 'none',
          }}
        >
          {['Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Tahoma', 'Comic Sans MS'].map(f => (
            <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
          ))}
        </select>
        {/* Size selector */}
        <select
          id="wp-size"
          defaultValue="3"
          onChange={(e) => document.execCommand('fontSize', false, e.target.value)}
          style={{
            height: '20px',
            width: '44px',
            border: '2px inset #c0c0c0',
            background: '#fff',
            fontSize: '8pt',
            cursor: 'default',
            outline: 'none',
          }}
        >
          {[
            { label: '8', value: '1' },
            { label: '10', value: '2' },
            { label: '14', value: '3' },
            { label: '18', value: '4' },
            { label: '24', value: '5' },
            { label: '36', value: '6' },
            { label: '48', value: '7' },
          ].map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <div style={{ width: '4px' }} />
        {/* Bold */}
        <button
          onClick={() => document.execCommand('bold')}
          title="Bold (Ctrl+B)"
          style={{
            width: '24px',
            height: '22px',
            background: '#c0c0c0',
            border: '2px outset #c0c0c0',
            fontSize: '11pt',
            fontWeight: 'bold',
            cursor: 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseDown={(e) => { e.preventDefault(); e.currentTarget.style.border = '2px inset #808080'; e.currentTarget.style.background = '#a0a0a0'; }}
          onMouseUp={(e) => { e.currentTarget.style.border = '2px outset #c0c0c0'; e.currentTarget.style.background = '#c0c0c0'; }}
        >
          B
        </button>
        {/* Italic */}
        <button
          onClick={() => document.execCommand('italic')}
          title="Italic (Ctrl+I)"
          style={{
            width: '24px',
            height: '22px',
            background: '#c0c0c0',
            border: '2px outset #c0c0c0',
            fontSize: '11pt',
            fontStyle: 'italic',
            cursor: 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseDown={(e) => { e.preventDefault(); e.currentTarget.style.border = '2px inset #808080'; e.currentTarget.style.background = '#a0a0a0'; }}
          onMouseUp={(e) => { e.currentTarget.style.border = '2px outset #c0c0c0'; e.currentTarget.style.background = '#c0c0c0'; }}
        >
          I
        </button>
        {/* Underline */}
        <button
          onClick={() => document.execCommand('underline')}
          title="Underline (Ctrl+U)"
          style={{
            width: '24px',
            height: '22px',
            background: '#c0c0c0',
            border: '2px outset #c0c0c0',
            fontSize: '11pt',
            textDecoration: 'underline',
            cursor: 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseDown={(e) => { e.preventDefault(); e.currentTarget.style.border = '2px inset #808080'; e.currentTarget.style.background = '#a0a0a0'; }}
          onMouseUp={(e) => { e.currentTarget.style.border = '2px outset #c0c0c0'; e.currentTarget.style.background = '#c0c0c0'; }}
        >
          U
        </button>
        {/* Color picker */}
        <div style={{ position: 'relative', width: '24px', height: '22px' }}>
          <input
            type="color"
            defaultValue="#000000"
            onChange={(e) => document.execCommand('foreColor', false, e.target.value)}
            title="Font Color"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'default',
              width: '100%',
              height: '100%',
            }}
          />
          <div style={{
            width: '24px',
            height: '22px',
            background: '#c0c0c0',
            border: '2px outset #c0c0c0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <img src="/assets/icons/w98_color_profile.ico" alt="Color" width={14} height={14} style={{ imageRendering: 'pixelated' }} />
          </div>
        </div>
      </div>

      {/* Ruler */}
      <div style={{
        height: '22px',
        background: '#c0c0c0',
        borderTop: '1px solid #ffffff',
        borderBottom: '1px solid #808080',
        position: 'relative',
        flexShrink: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
      }}>
        <div style={{
          flex: 1,
          height: '12px',
          background: '#ffffff',
          border: '1px inset #808080',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <span key={n} style={{
              position: 'absolute',
              left: `${n * 12.5}%`,
              transform: 'translateX(-50%)',
              fontSize: '7pt',
              color: '#000',
              userSelect: 'none',
              lineHeight: 1,
            }}>
              {n}
            </span>
          ))}
          {Array.from({ length: 33 }, (_, i) => {
            if (i % 4 === 0) return null;
            return (
              <div key={i} style={{
                position: 'absolute',
                left: `${i * 3.125}%`,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1px',
                height: i % 2 === 0 ? '5px' : '3px',
                background: '#808080',
              }} />
            );
          })}
          <div style={{
            position: 'absolute',
            left: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '8px',
            height: '14px',
            background: '#c0c0c0',
            border: '1px outset #c0c0c0',
            cursor: 'default',
          }} />
        </div>
      </div>

      {/* Document content — editable */}
      <div
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        style={{
          flex: 1,
          overflow: 'auto',
          background: '#ffffff',
          padding: '20px 28px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '9pt',
          lineHeight: 1.6,
          color: '#000',
          outline: 'none',
          cursor: 'text',
        }}
      >
        <h1 style={{ fontSize: '16pt', fontWeight: 'bold', fontStyle: 'italic', marginBottom: '4px', fontFamily: 'Times New Roman, serif' }}>
          Professional Experience
        </h1>
        <p style={{ fontSize: '8pt', color: '#666', marginBottom: '20px', borderBottom: '2px solid #000080', paddingBottom: '8px' }}>
          Wellisson Ribeiro — Senior Software Engineer
        </p>

        {experiences.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '2px', color: '#000' }}>
              {exp.company}
            </h2>
            <p style={{ fontSize: '8pt', color: '#666', marginBottom: '8px' }}>
              {exp.companyInfo}
            </p>

            {exp.roles.map((role, rIdx) => (
              <div key={rIdx} style={{ marginBottom: '12px', paddingLeft: '12px', borderLeft: '2px solid #000080' }}>
                <h3 style={{ fontSize: '9pt', fontWeight: 'bold', marginBottom: '1px' }}>
                  {role.role}
                </h3>
                <p style={{ fontSize: '7pt', color: '#666', marginBottom: '4px' }}>
                  {role.period} · {role.location}
                </p>

                <ul style={{ paddingLeft: '14px', marginBottom: '6px' }}>
                  {role.description.map((item, i) => (
                    <li key={i} style={{ fontSize: '8pt', marginBottom: '3px', lineHeight: 1.5 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {idx < experiences.length - 1 && (
              <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', marginTop: '8px' }} />
            )}
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div style={{
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 6px',
        background: '#c0c0c0',
        borderTop: '1px solid #ffffff',
        flexShrink: 0,
        fontSize: '7pt',
        color: '#000',
      }}>
        For Help, press F1
      </div>
    </div>
  );
};

export default ExperienceWindow;
