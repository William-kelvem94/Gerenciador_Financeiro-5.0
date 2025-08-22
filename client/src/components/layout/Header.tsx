const Header = () => (
  <header className="flex items-center justify-between px-8 py-4 bg-background-secondary rounded-b-lg shadow-neon mb-4">
    <h1 className="text-2xl text-neon font-bold">Will Finance 5.0</h1>
    <div className="flex items-center gap-4">
      <span className="text-foreground-muted">Usuário</span>
      <img src="https://api.dicebear.com/7.x/identicon/svg?seed=will" alt="avatar" className="w-8 h-8 rounded-full border border-cyber-primary" />
    </div>
  </header>
);

export default Header;
