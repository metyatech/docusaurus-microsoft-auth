import React from 'react';

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '0.85rem',
  background: 'var(--ifm-background-color)',
  color: 'var(--ifm-font-color-base)',
  fontFamily: 'var(--ifm-font-family-base)',
};

const spinnerStyle: React.CSSProperties = {
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: '50%',
  border: '3px solid rgba(66, 153, 225, 0.25)',
  borderTopColor: 'rgba(47, 128, 237, 0.95)',
  animation: 'spin 0.9s linear infinite',
};

const captionStyle: React.CSSProperties = {
  fontSize: '1rem',
  opacity: 0.8,
};

const spinnerKeyframes = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;

export type LoadingScreenProps = {
  message?: string;
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => (
  <div style={containerStyle}>
    <style>{spinnerKeyframes}</style>
    <div style={spinnerStyle} aria-hidden />
    <p style={captionStyle}>{message ?? 'サインインを確認しています…'}</p>
  </div>
);

export default LoadingScreen;
