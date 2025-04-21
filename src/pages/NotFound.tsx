
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-6xl font-bold text-dovito">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="mt-8">
          <Button>Return to Home</Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
