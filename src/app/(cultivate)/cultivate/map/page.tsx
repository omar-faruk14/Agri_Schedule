"use client";
import dynamic from "next/dynamic";

// Dynamically import the GoogleMap component with ssr: false
const GoogleMap = dynamic(() => import("./GoogleMap"), {
  ssr: false,
});

const HomePage: React.FC = () => {
  return (
    <div>
      <GoogleMap center={[36.665251, 138.180077]} zoom={19} />
    </div>
  );
};

export default HomePage;
