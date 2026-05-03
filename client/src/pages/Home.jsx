import HeroSlider from "../components/HeroSlider";
import ProductList from "../components/ProductLists";
import FullScreenAd from "../components/FullScreenAd";
import FullScreenadVideos from "../data/FullScreenadVideos";
import VideoAd from "../components/VideoAd";
import adVideos from "../data/adVideos";
import { useState } from "react";

export default function Home() {
  const [showAd, setShowAd] = useState(true);

  return (
    <div>
      {showAd && <FullScreenAd videos={FullScreenadVideos} onClose={() => setShowAd(false)} />}
      <HeroSlider />
      <VideoAd videos={adVideos}/>
      <ProductList />
    </div>
  );
}
