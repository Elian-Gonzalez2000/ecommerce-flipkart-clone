import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import Carrousel from "../../components/UI/Carrousel/Carrousel";
import PremiumProducts from "../../components/PremiumProducts";
import { Helmet } from "react-helmet";

const HomePage = (props) => {
  return (
    <Layout>
      <Helmet>
        <title>
          {
            "Online Shopping Site for Mobiles, Electronics, Furniture, Grocery, Lifestyle, Books & More. Best Offers!"
          }
        </title>
        <meta property="og:title" content="Flipkart Clone" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/"
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/ecommerce-flipkart-clone.appspot.com/o/general%2Fflipkart-metatags.png?alt=media&token=ae918f5a-699d-4b31-8963-ba9b6e2a4167"
        />
        <meta
          property="og:description"
          content="Online Shopping India Mobile, Cameras, Lifestyle &amp; more Online @ Flipkart.com"
        />

        <meta
          name="twitter:url"
          content="https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/"
        />
        <meta name="twitter:title" content="Flipkart Clone" />
        <meta
          name="twitter:description"
          content="Online Shopping India Mobile, Cameras, Lifestyle &amp; more Online @ Flipkart.com"
        />
        <meta
          name="twitter:image"
          content="https://firebasestorage.googleapis.com/v0/b/ecommerce-flipkart-clone.appspot.com/o/general%2Fflipkart-metatags.png?alt=media&token=ae918f5a-699d-4b31-8963-ba9b6e2a4167"
        />
        <link
          rel="canonical"
          href="https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/"
        />
      </Helmet>

      <Carrousel />
      <PremiumProducts />
    </Layout>
  );
};

export default HomePage;
