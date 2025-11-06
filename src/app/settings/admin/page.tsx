import React from 'react';

const EmbeddedSite: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="https://mis-gestiones-admin.vercel.app/"
        title="Mis gestiones - Admin"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        allowFullScreen
      />
    </div>
  );
};

export default EmbeddedSite;
