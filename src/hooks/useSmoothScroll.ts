import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function getPrefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function useSmoothScroll() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPrefersReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.motion = prefersReducedMotion ? "reduced" : "full";
    }

    if (prefersReducedMotion || typeof window === "undefined") {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.05,
      infinite: false,
    });

    const onLenisScroll = (event) => {
      ScrollTrigger.update();
      const limit = event.limit || 0;
      const progress = limit > 0 ? event.scroll / limit : 0;
      window.dispatchEvent(
        new CustomEvent("lenis-progress", {
          detail: {
            progress,
            scroll: event.scroll,
            limit,
          },
        })
      );
    };

    lenis.on("scroll", onLenisScroll);

    const onTick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return { prefersReducedMotion };
}
