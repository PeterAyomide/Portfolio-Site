import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollScene({
  id,
  className = "",
  duration = 180,
  onProgress,
  buildTimeline,
  children,
}) {
  const sceneRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const isReducedMotion =
      typeof document !== "undefined" && document.documentElement.dataset.motion === "reduced";

    if (isReducedMotion || !sceneRef.current || !contentRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sceneRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (duration / 100)}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (onProgress) {
              onProgress(self.progress);
            }
          },
        },
      });

      if (buildTimeline) {
        buildTimeline(timeline, contentRef.current);
      }
    }, sceneRef);

    return () => ctx.revert();
  }, [duration, onProgress, buildTimeline]);

  return (
    <section id={id} ref={sceneRef} className={`scroll-scene ${className}`.trim()}>
      <div ref={contentRef} className="scroll-scene-content">
        {children}
      </div>
    </section>
  );
}
