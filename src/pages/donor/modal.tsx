import React, { useState } from 'react';
import {
  MdClose,
  MdCheckCircle,
  MdCalendarMonth,
  MdAccessTime,
} from 'react-icons/md';

interface Hospital {
  id: string;
  name: string;
  type: string;
  phone: string;
}

interface BookingFormData {
  nome: string;
  tipoSangue: string;
  data: string;
  hora: string;
  observacoes: string;
}

interface BookingModalProps {
  hospital: Hospital;
  onClose: () => void;
  onConfirm: (formData: BookingFormData) => void;
}

type Step = 'form' | 'success';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const today = new Date().toISOString().split('T')[0];

export const BookingModal: React.FC<BookingModalProps> = ({
  hospital,
  onClose,
  onConfirm,
}) => {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<BookingFormData>({
    nome: '',
    tipoSangue: '',
    data: '',
    hora: '',
    observacoes: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof BookingFormData, string>>
  >({});

  const set =
    (field: keyof BookingFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.nome.trim()) newErrors.nome = 'Campo obrigatório';
    if (!form.tipoSangue) newErrors.tipoSangue = 'Campo obrigatório';
    if (!form.data) newErrors.data = 'Campo obrigatório';
    if (!form.hora) newErrors.hora = 'Campo obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onConfirm(form);
    setStep('success');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('pt-AO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0,0,0,0.5)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          width: '100%',
          maxWidth: 440,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        }}
      >
        {/* top accent */}
        <div style={{ height: 3, background: '#10B981' }} />

        <div style={{ padding: '1.5rem' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  margin: 0,
                  color: '#111827',
                }}
              >
                Agendar visita
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
                {hospital.name}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#F3F4F6',
                border: 'none',
                borderRadius: '50%',
                width: 30,
                height: 30,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280',
                flexShrink: 0,
              }}
            >
              <MdClose size={15} />
            </button>
          </div>

          {/* ── FORM ── */}
          {step === 'form' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Nome */}
              <Field label="Nome completo" error={errors.nome}>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  value={form.nome}
                  onChange={set('nome')}
                  style={inputStyle(!!errors.nome)}
                />
              </Field>

              {/* Tipo de sangue */}
              <Field label="Tipo de sangue" error={errors.tipoSangue}>
                <select
                  value={form.tipoSangue}
                  onChange={set('tipoSangue')}
                  style={inputStyle(!!errors.tipoSangue)}
                >
                  <option value="">Selecionar...</option>
                  {BLOOD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Data + Hora */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                <Field
                  label="Data"
                  error={errors.data}
                  icon={<MdCalendarMonth size={14} color="#10B981" />}
                >
                  <input
                    type="date"
                    min={today}
                    value={form.data}
                    onChange={set('data')}
                    style={inputStyle(!!errors.data)}
                  />
                </Field>
                <Field
                  label="Hora"
                  error={errors.hora}
                  icon={<MdAccessTime size={14} color="#10B981" />}
                >
                  <input
                    type="time"
                    value={form.hora}
                    onChange={set('hora')}
                    style={inputStyle(!!errors.hora)}
                  />
                </Field>
              </div>

              {/* Observações */}
              <Field label="Observações" hint="(opcional)">
                <textarea
                  placeholder="Ex: Primeira vez a doar, tenho alergia a..."
                  value={form.observacoes}
                  onChange={set('observacoes')}
                  rows={2}
                  style={{
                    ...inputStyle(false),
                    height: 'auto',
                    resize: 'none',
                    fontFamily: 'inherit',
                    paddingTop: 8,
                    paddingBottom: 8,
                  }}
                />
              </Field>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    height: 42,
                    borderRadius: 10,
                    border: '1.5px solid #E5E7EB',
                    background: 'white',
                    color: '#374151',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  style={{
                    flex: 2,
                    height: 42,
                    borderRadius: 10,
                    border: 'none',
                    background: '#10B981',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Confirmar agendamento
                </button>
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '0.5rem 0 0.25rem' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#D1FAE5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <MdCheckCircle size={28} color="#059669" />
              </div>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  margin: '0 0 8px',
                  color: '#111827',
                }}
              >
                Pedido enviado!
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: '#6B7280',
                  margin: '0 0 8px',
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: '#111827' }}>{form.nome}</strong>, o seu
                pedido para{' '}
                <strong style={{ color: '#111827' }}>
                  {formatDate(form.data)}
                </strong>{' '}
                às <strong style={{ color: '#111827' }}>{form.hora}</strong>{' '}
                (tipo{' '}
                <strong style={{ color: '#111827' }}>{form.tipoSangue}</strong>)
                foi enviado.
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: '#9CA3AF',
                  margin: '0 0 24px',
                }}
              >
                O hospital confirmará em breve.
              </p>
              <button
                onClick={onClose}
                style={{
                  height: 40,
                  padding: '0 28px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#10B981',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── helpers ─── */

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: '100%',
    height: 38,
    borderRadius: 8,
    border: `1.5px solid ${hasError ? '#EF4444' : '#E5E7EB'}`,
    background: 'white',
    color: '#111827',
    padding: '0 12px',
    fontSize: 13,
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
  };
}

function Field({
  label,
  hint,
  error,
  icon,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginBottom: 6,
        }}
      >
        {icon}
        {label}
        {hint && (
          <span style={{ fontWeight: 400, color: '#9CA3AF' }}>{hint}</span>
        )}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: 11, color: '#EF4444', margin: '4px 0 0' }}>
          {error}
        </p>
      )}
    </div>
  );
}
