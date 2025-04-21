
import { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/auth/AuthForm';
import Layout from '@/components/layout/Layout';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get the redirect path from location state or default to '/'
  const from = (location.state as { from?: string })?.from || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12">
        <AuthForm defaultTab={searchParams.get('tab') || 'signin'} />
      </div>
    </Layout>
  );
};

export default Login;
