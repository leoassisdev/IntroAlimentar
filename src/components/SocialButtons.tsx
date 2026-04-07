const SocialButtons = () => {
  const socials = [
    {
      name: "instagram",
      label: "Instagram",
      tooltipBg: "linear-gradient(45deg, #405de6, #5b51db, #b33ab4, #e1306c, #fd1f1f)",
      href: "https://www.instagram.com/flowcorebr/",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      name: "youtube",
      label: "YouTube",
      tooltipBg: "#ff0000",
      href: "https://www.youtube.com/@FlowCoreSolu%C3%A7%C3%B5es",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.5a3.1 3.1 0 0 0-2.2-2.2C19.4 3.8 12 3.8 12 3.8s-7.4 0-9.3.5A3.1 3.1 0 0 0 .5 6.5 32.5 32.5 0 0 0 0 12a32.5 32.5 0 0 0 .5 5.5 3.1 3.1 0 0 0 2.2 2.2c1.9.5 9.3.5 9.3.5s7.4 0 9.3-.5a3.1 3.1 0 0 0 2.2-2.2A32.5 32.5 0 0 0 24 12a32.5 32.5 0 0 0-.5-5.5zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
        </svg>
      ),
    },
    {
      name: "github",
      label: "GitHub",
      tooltipBg: "#2b7de9",
      href: "https://github.com/leoassisdev",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[30px] h-[30px] relative z-[1]">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
    {
      name: "website",
      label: "Site",
      tooltipBg: "linear-gradient(135deg, hsl(354 100% 80%), hsl(260 60% 75%))",
      href: "https://flowcoresolucoes.com/",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="social-btn-group">
      {socials.map((s) => (
        <div key={s.name} className="social-btn-wrap">
          <a
            href={s.href}
            className="social-btn"
            data-social={s.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="filled" />
            {s.icon}
          </a>
          <span className="social-tooltip" style={{ background: s.tooltipBg }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SocialButtons;
