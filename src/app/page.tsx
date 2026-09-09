import { Hero } from "@/components/home/Hero";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { RestauroSection } from "@/components/home/RestauroSection";
import { Showcase } from "@/components/home/Showcase";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <RestauroSection />
      <Showcase />
    </>
  );
}
