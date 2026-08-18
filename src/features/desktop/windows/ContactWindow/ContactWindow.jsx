import { contactInfo } from "../../../../data/contactInfo";
import Icon from "../../../../components/Icon/Icon";

const ContactWindow = ({ windowId, onClose }) => {
  const contacts = Object.entries(contactInfo).map(([key, value]) => ({ key, ...value }));

  return (
    <div style={{ padding: '8px', height: '100%', overflow: 'auto' }}>
      <h3 style={{ fontSize: '10pt', fontWeight: 'bold', marginBottom: '12px', color: '#000080' }}>
        Get in Touch
      </h3>
      <p style={{ fontSize: '8pt', marginBottom: '16px', lineHeight: 1.5, color: '#666' }}>
        Feel free to reach out through any of the channels below.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {contacts.map(contact => (
          <a
            key={contact.key}
            href={contact.link}
            target={contact.link?.startsWith('http') ? '_blank' : undefined}
            rel={contact.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: '#fff',
              border: '2px outset #c0c0c0',
              textDecoration: 'none',
              color: '#000',
              transition: 'all 100ms'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.border = '2px inset #c0c0c0'; e.currentTarget.style.background = '#f0f0f0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.border = '2px outset #c0c0c0'; e.currentTarget.style.background = '#fff'; }}
            onFocus={(e) => { e.currentTarget.style.border = '2px inset #c0c0c0'; e.currentTarget.style.background = '#f0f0f0'; }}
            onBlur={(e) => { e.currentTarget.style.border = '2px outset #c0c0c0'; e.currentTarget.style.background = '#fff'; }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              border: '1px inset #c0c0c0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f0f0f0',
              flexShrink: 0
            }}>
              <Icon name={contact.key} size={24} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '7pt', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {contact.label}
              </div>
              <div style={{ fontSize: '8pt', fontWeight: 'bold', color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {contact.value}
              </div>
            </div>
            <Icon name="gear" size={16} style={{ opacity: 0.5 }} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ContactWindow;