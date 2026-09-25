import React, { useState, useEffect } from 'react';
import { Mail, User, Clock, Globe, Video, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function EmailModal({ onEnterClassroom }) {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmails = () => {
    setIsLoading(true);
    api.getNotifications()
      .then(res => {
        if (res.success) {
          setEmails(res.data);
          if (res.data.length > 0 && !selectedEmail) {
            setSelectedEmail(res.data[0]);
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const filteredEmails = emails.filter(e => {
    if (filter === 'PARENT') return e.recipientType === 'PARENT';
    if (filter === 'MENTOR') return e.recipientType === 'MENTOR';
    return true;
  });

  return (
    <div id="email-simulator-container" style={{ background: 'white', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '28px', boxShadow: 'var(--shadow-md)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={22} color="var(--primary)" />
            <span>Simulated Email Communications Hub</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Inspect localized email confirmations automatically dispatched to parents (US/UK local time) and mentors (India IST).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" style={{ padding: '8px 12px' }} onClick={fetchEmails}>
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '12.5px', background: filter === 'ALL' ? '#eef2ff' : 'white', borderColor: filter === 'ALL' ? 'var(--primary)' : 'var(--border-subtle)' }}
          onClick={() => setFilter('ALL')}
        >
          All Emails ({emails.length})
        </button>
        <button
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '12.5px', background: filter === 'PARENT' ? '#e0f2fe' : 'white', borderColor: filter === 'PARENT' ? '#0284c7' : 'var(--border-subtle)' }}
          onClick={() => setFilter('PARENT')}
        >
          Parent Emails ({emails.filter(e => e.recipientType === 'PARENT').length})
        </button>
        <button
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '12.5px', background: filter === 'MENTOR' ? '#ecfdf5' : 'white', borderColor: filter === 'MENTOR' ? '#10b981' : 'var(--border-subtle)' }}
          onClick={() => setFilter('MENTOR')}
        >
          Mentor Emails ({emails.filter(e => e.recipientType === 'MENTOR').length})
        </button>
      </div>

      {/* 2-Pane Email Inbox View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '20px', minHeight: '500px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {/* Left Pane: Email List */}
        <div style={{ background: '#f8fafc', borderRight: '1px solid var(--border-subtle)', overflowY: 'auto', maxHeight: '600px' }}>
          {filteredEmails.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', fontSize: '13px' }}>
              No emails dispatched yet. Book a trial class to trigger automated notifications!
            </p>
          ) : (
            filteredEmails.map(mail => {
              const isSelected = selectedEmail?.id === mail.id;
              const isParent = mail.recipientType === 'PARENT';

              return (
                <div
                  key={mail.id}
                  style={{
                    padding: '14px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    background: isSelected ? 'white' : 'transparent',
                    borderLeft: isSelected ? '4px solid var(--primary)' : '4px solid transparent'
                  }}
                  onClick={() => setSelectedEmail(mail)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-pill)',
                        background: isParent ? '#e0f2fe' : '#ecfdf5',
                        color: isParent ? '#0369a1' : '#047857'
                      }}
                    >
                      {mail.recipientType}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {new Date(mail.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                    To: {mail.recipientName}
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {mail.subject}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Pane: Selected Email Viewer */}
        <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '600px', background: 'white' }}>
          {selectedEmail ? (
            <div>
              {/* Email Meta Card */}
              <div style={{ paddingBottom: '18px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    background: selectedEmail.recipientType === 'PARENT' ? '#e0f2fe' : '#ecfdf5',
                    color: selectedEmail.recipientType === 'PARENT' ? '#0369a1' : '#047857',
                    marginBottom: '8px'
                  }}
                >
                  {selectedEmail.recipientType === 'PARENT' ? 'Sent to Parent' : 'Sent to Mentor in India'}
                </span>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  {selectedEmail.subject}
                </h3>

                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  <div><strong>To:</strong> {selectedEmail.recipientName} ({selectedEmail.recipientEmail})</div>
                  <div><strong>Timezone Context:</strong> {selectedEmail.timezone}</div>
                  <div><strong>Local Session Time:</strong> {selectedEmail.localDateTime}</div>
                </div>

                {selectedEmail.meetingLink && (
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '12.5px' }}
                      onClick={() => onEnterClassroom(selectedEmail.meetingLink.split('/').pop())}
                    >
                      <Video size={14} />
                      <span>Test Dummy Link (Enter Classroom)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Email Body Rendering */}
              <div
                dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody }}
                style={{ fontSize: '14px', lineHeight: 1.6 }}
              />
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              Select an email from the left pane to view its localized contents.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
