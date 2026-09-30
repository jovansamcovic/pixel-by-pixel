import { BottomNavigation } from "@/src/3-widgets/bottom-navigation/BottomNavigation";
import { CampaignWidget } from "@/src/3-widgets/campaign/CampaignWidget";
import Footer from "@/src/4-features/footer/Footer";
import Header from "@/src/4-features/header/Header";
import { getDeviceDetector } from "@/src/6-shared/utils";

export async function HomePage() {
  const device = await getDeviceDetector();

  return (
    <main>
      <Header />
      <CampaignWidget isMobile={device?.isMobile} />
      <Footer />
      <BottomNavigation />
    </main>
  );
}