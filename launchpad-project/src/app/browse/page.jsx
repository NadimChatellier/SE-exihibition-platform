import { Suspense } from "react";
import BrowseClient from "./BrowseClient";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function BrowsePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowseClient />
    </Suspense>
  );
}
