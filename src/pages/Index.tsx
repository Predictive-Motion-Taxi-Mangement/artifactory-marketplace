
import React from "react";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/ui-custom/HeroSection";
import FeaturedArtworks from "@/components/ui-custom/FeaturedArtworks";
import CategorySection from "@/components/ui-custom/CategorySection";
import FeaturedArtists from "@/components/ui-custom/FeaturedArtists";
import NewsletterSection from "@/components/ui-custom/NewsletterSection";

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedArtworks />
      <CategorySection />
      <FeaturedArtists />
      <NewsletterSection />
    </Layout>
  );
};

export default Index;
