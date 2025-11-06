import React from 'react';

const EmbeddedSite: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="https://mis-gestiones-backend.vercel.app/docs"
        title="Mis gestiones - Admin - API"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        allowFullScreen
      />
    </div>
  );
};

export default EmbeddedSite;
