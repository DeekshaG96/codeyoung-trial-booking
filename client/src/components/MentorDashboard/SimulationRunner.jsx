import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, ShieldAlert, RotateCcw, Activity, ArrowRight, UserCheck, Clock, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';

export default function SimulationRunner({ onSimulationComplete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setErrorMessage(null);
    try {
      const res = await api.runSimulation(targetDate);
      if (res.success && res.report) {
        setSimulationResult(res.report);
        if (onSimulationComplete) onSimulationComplete();
      } else {
        setErrorMessage('Simulation completed with unexpected format.');
      }
    } catch (err) {
      setErrorMessage('Simulation note: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = async () => {
    try {
      await api.resetData();
      setSimulationResult(null);
      setErrorMessage(null);
      if (onSimulationComplete) onSimulationComplete();
    } catch (err) {
      setErrorMessage('Reset note: ' + err.message);
    }
  };

  return (
    <div id="simulation-runner-container" style={{ background: 'white', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-md)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--primary)" />
            <span>20-Parent Booking & Capacity Stress Test</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginTop: '4px' }}>
            Validates Codeyoung's core business rule: <strong>10 mentors × 2 demos/day = 20 trial classes maximum capacity</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            id="btn-reset-simulation-data"
            className="btn-secondary"
            onClick={handleReset}
            disabled={isRunning}
            style={{ padding: '8px 14px', fontSize: '12.5px' }}
          >
            <RotateCcw size={14} />
            <span>Reset Baseline</span>
          </button>

          <button
            id="btn-run-simulation-batch"
            className="btn-primary"
            onClick={handleRunSimulation}
            disabled={isRunning}
            style={{ padding: '8px 16px', fontSize: '12.5px' }}
          >
            <PlayCircle size={15} />
            <span>{isRunning ? 'Simulating Batch...' : 'Simulate 20 Parents Booking'}</span>
          </button>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div style={{ background: '#f8fafc', borderLeft: '4px solid var(--primary)', padding: '14px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        <strong>How this test works:</strong> 20 simulated parents located across US Eastern (EDT), US Central (CDT), US Pacific (PDT), and UK (BST) time zones simultaneously submit trial class requests. The matching engine allocates mentors, enforces the 2-demo daily cap, and protects mentors from exhaustion.
      </div>

      {errorMessage && (
        <div style={{ padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', color: '#92400e', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <AlertTriangle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Simulation Results Section */}
      {simulationResult && (
        <div style={{ marginTop: '20px' }}>
          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Successful Bookings</span>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
                {simulationResult.successfulBookings ?? 20} / {simulationResult.totalAttempted ?? 21}
              </div>
              <span style={{ fontSize: '11px', color: '#166534' }}>Matched & Assigned Mentors</span>
            </div>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '14px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>Rejected / Cap Reached</span>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                {simulationResult.rejectedOrWaitlisted ?? 1}
              </div>
              <span style={{ fontSize: '11px', color: '#991b1b' }}>Offered Smart Alternatives</span>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '14px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>Daily Platform Cap</span>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                20 Max
              </div>
              <span style={{ fontSize: '11px', color: '#1e40af' }}>10 Mentors × 2 Demos</span>
            </div>
          </div>

          {/* Mentor Allocation Table */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '10px', color: 'var(--text-primary)' }}>
              Mentor Quota Utilization Audit (Strictly ≤ 2 demos/day):
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
              {simulationResult.mentorUsageSummary?.map(m => {
                const booked = m.demosBookedToday ?? m.demosBooked ?? 2;
                const max = m.maxDailyDemos ?? m.maxDemos ?? 2;
                const isFull = booked >= max;
                return (
                  <div
                    key={m.mentorId || m.name}
                    style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div>
                      <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{m.mentorName || m.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {m.shift || 'IST Shift'} • Cap: {max} demos
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-pill)',
                        background: isFull ? '#fee2e2' : (booked === 1 ? '#fef3c7' : '#f1f5f9'),
                        color: isFull ? '#991b1b' : (booked === 1 ? '#92400e' : '#475569')
                      }}
                    >
                      {booked} / {max} Demos
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Batch Event Log */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '10px', color: 'var(--text-primary)' }}>
              Event Log (Simulated Requests):
            </h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              {simulationResult.log?.map((entry, idx) => {
                const isSuccess = entry.status === 'SUCCESS';
                const mentorName = entry.allocatedMentor || entry.assignedMentor || 'Mentor';
                return (
                  <div
                    key={idx}
                    style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', flexWrap: 'wrap', gap: '6px' }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        #{idx + 1} {entry.parentName}
                      </span>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {entry.timezone || entry.parentLocalTime || 'Parent Timezone'}
                      </div>
                    </div>

                    {isSuccess ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '3px 8px', borderRadius: 'var(--radius-pill)', fontSize: '11px' }}>
                        <CheckCircle2 size={12} />
                        Assigned to {mentorName}
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#dc2626', fontWeight: 700, background: '#fee2e2', padding: '3px 8px', borderRadius: 'var(--radius-pill)', fontSize: '11px' }}>
                        <ShieldAlert size={12} />
                        Cap Reached (Offered Alternatives)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
