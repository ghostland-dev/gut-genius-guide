import { AuthForm } from "@/components/AuthForm";
import { SEO } from "@/components/SEO";

const Auth = () => {
  return (
    <>
      <SEO 
        title="Connexion - SmartMealPlanner"
        description="Connectez-vous à votre compte SmartMealPlanner pour accéder à vos programmes nutritionnels personnalisés."
      />
      <AuthForm />
    </>
  );
};

export default Auth;