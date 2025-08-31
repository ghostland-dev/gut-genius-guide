import { DashboardMain } from "@/components/Dashboard";
import { SEO } from "@/components/SEO";

const Dashboard = () => {
  return (
    <>
      <SEO 
        title="Tableau de Bord - SmartMealPlanner"
        description="Gérez vos programmes nutritionnels, suivez vos objectifs santé et optimisez vos courses avec SmartMealPlanner."
      />
      <DashboardMain />
    </>
  );
};

export default Dashboard;