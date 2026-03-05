import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-secondary p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg">
            <Target className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-content-primary">BudgetLens</h1>
            <p className="text-sm text-content-secondary">
              Suivi financier intelligent
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="card p-8">
          <h2 className="mb-6 text-xl font-semibold text-content-primary">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                  Nom complet
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Thierry Sessou"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="thierry@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-content-secondary">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-secondary"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              {isLogin ? 'Se connecter' : 'Creer un compte'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-content-brand hover:underline"
            >
              {isLogin
                ? 'Pas encore de compte ? Inscrivez-vous'
                : 'Deja un compte ? Connectez-vous'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
