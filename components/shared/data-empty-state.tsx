import React from 'react';

export interface DataEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function DataEmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction
}: DataEmptyStateProps) {
  return (
    <div className="success" style={{ margin: '40px auto', maxWidth: 560, textAlign: 'center', padding: '48px 32px' }}>
      {icon && (
        <div style={{ fontSize: 36, marginBottom: 16, color: 'var(--accent)' }}>
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: 24, margin: '0 0 8px', fontFamily: '"Fraunces", Georgia, serif' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
        {description}
      </p>
      {(actionLabel && (actionHref || onAction)) && (
        actionHref ? (
          <a href={actionHref} className="btn">
            {actionLabel}
          </a>
        ) : (
          <button onClick={onAction} className="btn">
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}
