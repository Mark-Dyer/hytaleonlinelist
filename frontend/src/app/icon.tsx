import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: 'scaleX(-1)' }}
        >
          <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
          <line x1="13" x2="19" y1="19" y2="13" />
          <line x1="16" x2="20" y1="16" y2="20" />
          <line x1="19" x2="21" y1="21" y2="19" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
