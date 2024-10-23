import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import Carrousel from "../../components/UI/Carrousel/Carrousel";
import PremiumProducts from "../../components/PremiumProducts";

const HomePage = (props) => {
  return (
    <Layout>
      <Carrousel />
      <PremiumProducts />
    </Layout>
  );
};

export default HomePage;
