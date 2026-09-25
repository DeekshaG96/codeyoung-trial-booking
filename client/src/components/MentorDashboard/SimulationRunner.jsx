import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, ShieldAlert, RotateCcw, Activity, ArrowRight, UserCheck, Clock } from 'lucide-react';
import { api } from '../../services/api';

export default function SimulationRunner({ onSimulationComplete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    try {
      const res = await api.runSimulation(targetDate);
      if (res.success) {
        setSimulationResult(res.report);
        if (onSimulationComplete) onSimulationComplete();
      }
    } catch (err) {
      alert('Error running simulation: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = async () => {
    try {
      await api.resetData();
      setSimulationResult(null);
      if (onSimulationComplete) onSimulationComplete();
    } catch (err) {
      alert('Reset failed: ' + err.message);
    }
  };

  return (
    <div id="simulation-runner-container" style={{ background: 'white', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '28px', boxShadow: 'var(--shadow-md)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={22} color="var(--primary)" />
            <span>20-Parent Booking & Capacity Stress Test</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Validates Codeyoung's core business rule: <strong>10 mentors × 2 demos/day = 20 trial classes maximum capacity</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            id="btn-reset-simulation-data"
            className="btn-secondary"
            onClick={handleReset}
            disabled={isRunning}
          >
            <RotateCcw size={15} />
            <span>Reset Baseline</span>
          </button>

          <button
            id="btn-run-simulation-batch"
            className="btn-primary"
            onClick={handleRunSimulation}
            disabled={isRunning}
          >
            <PlayCircle size={16} />
            <span>{isRunning ? 'Simulating Batch...' : 'Simulate 20 Parents Booking'}</span>
          </button>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div style={{ background: '#f8fafc', borderLeft: '4px solid var(--primary)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        <strong>How this test works:</strong> 20 simulated parents located across US Eastern (EDT), US Central (CDT), US Pacific (PDT), and UK (BST) time zones simultaneously submit trial class requests across different hours of the day. The matching engine allocates mentors, enforces the 2-demo daily cap, prevents booking collisions, and returns a graceful error state if quota is reached.
      </div>

      {/* Simulation Results Section */}
      {simulationResult && (
        <div style={{ marginTop: '24px' }}>
          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Successful Bookings</span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>
                {simulationResult.successfulBookings} / {simulationResult.totalAttempted}
              </div>
              <span style={{ fontSize: '11px', color: '#166534' }}>Matched & Assigned Mentors</span>
            </div>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>Rejected / Cap Reached</span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                {simulationResult.rejectedOrWaitlisted}
              </div>
              <span style={{ fontSize: '11px', color: '#991b1b' }}>Offered Smart Alternatives</span>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>Daily Platform Cap</span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                20 Max
              </div>
              <span style={{ fontSize: '11px', color: '#1e40af' }}>10 Mentors × 2 Demos</span>
            </div>
          </div>

          {/* Mentor Allocation Table */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '10px', color: 'var(--text-primary)' }}>
              Mentor Quota Utilization Audit (Strictly ≤ 2 demos/day):
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
              {simulationResult.mentorUsageSummary?.map(m => (
                <div
                  key={m.mentorId}
                  style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{m.name}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Cap: {m.maxDemos} demos / day
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      background: m.capReached ? '#fee2e2' : (m.demosBooked === 1 ? '#fef3c7' : '#f1f5f9'),
                      color: m.capReached ? '#991b1b' : (m.demosBooked === 1 ? '#92400e' : '#475569')
                    }}
                  >
                    {m.demosBooked} / {m.maxDemos} Demos
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Batch Event Log */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '10px', color: 'var(--text-primary)' }}>
              Event Log (All 20 Parent Requests):
            </h4>
            <div style={{ maxHeight: '320px', overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              {simulationResult.log?.map((entry, idx) => (
                <div
                  key={idx}
                  style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}
                >
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      #{idx + 1} {entry.parentName} (Child: {entry.childName}, {entry.subject})
                    </span>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {entry.parentLocalTime}
                    </div>
                  </div>

                  {entry.status === 'SUCCESS' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '3px 8px', borderRadius: 'var(--radius-pill)', fontSize: '11.5px' }}>
                      <CheckCircle2 size={13} />
                      Assigned to {entry.assignedMentor}
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#dc2626', fontWeight: 700, background: '#fee2e2', padding: '3px 8px', borderRadius: 'var(--radius-pill)', fontSize: '11.5px' }}>
                      <ShieldAlert size={13} />
                      Cap Reached (Suggested {entry.suggestedSlotsCount} alternatives)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
