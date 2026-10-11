import { BottomNavigation } from "@/src/3-widgets/bottom-navigation";
import { CampaignWidget } from "@/src/3-widgets/campaign";
import Footer from "@/src/4-features/footer/facade";
import Header from "@/src/4-features/header/facade";
import { MOCK_HEART_STATE } from "@/src/5-entities/heart-pixel/mock/heart-state";
import { getDeviceDetector } from "@/src/6-shared/utils";

export async function HomePage() {
  const device = await getDeviceDetector();

  // Kad BE bude gotov: const heart = await getHeartState();
  const heart = MOCK_HEART_STATE;

  return (
    <main>
      <Header />
      <CampaignWidget isMobile={device?.isMobile ?? false} heart={heart} />
      <Footer />
      <BottomNavigation />
    </main>
  );
}