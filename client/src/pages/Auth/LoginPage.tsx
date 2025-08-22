const LoginPage = () => {
  return (
    <div className="card">
      <h1 className="card-title text-neon">Login</h1>
      <form className="space-y-4">
        <input className="input" type="email" placeholder="E-mail" required />
        <input className="input" type="password" placeholder="Senha" required />
        <button className="btn-primary" type="submit">Entrar</button>
      </form>
    </div>
  );
};
export default LoginPage;
