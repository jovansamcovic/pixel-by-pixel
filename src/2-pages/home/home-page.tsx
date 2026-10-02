import { BottomNavigation } from "@/src/3-widgets/bottom-navigation";
import { CampaignWidget } from "@/src/3-widgets/campaign";
import Footer from "@/src/4-features/footer/facade";
import Header from "@/src/4-features/header/facade";
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