import { css } from "goober";
import {
  ComponentProps,
  ReactNode,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export default function CardSwipe(props: {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  active: boolean;
  children: (scrollTimeline: any) => ReactNode;
}) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [scrollTimeline, setScrollTimeline] = useState<any>(null);

  useLayoutEffect(() => {
    scrollContainer.current &&
      scrollContainer.current.scroll({
        left: scrollContainer.current.scrollWidth / 2,
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            switch ((entry.target as HTMLElement).dataset.direction) {
              case "left":
                return props.onSwipeLeft();
              case "right":
                return props.onSwipeRight();
            }
          }
        });
      },
      { threshold: 0.7, root: scrollContainer.current }
    );
    scrollContainer.current
      ?.querySelectorAll("[data-direction]")
      .forEach(observer.observe.bind(observer));
    //@ts-ignore
    const timeline = new ScrollTimeline({
      source: scrollContainer.current,
      orientation: "inline",
      scrollOffsets: [
        //@ts-ignore
        new CSSUnitValue(0, "percent"),
        //@ts-ignore
        new CSSUnitValue(100, "percent"),
      ],
    });
    setScrollTimeline(timeline);
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <>
      <div
        className={css`
          height: 100%;
          width: 100%;
          overflow-x: scroll;
          position: absolute;
          top: 0;
          scroll-snap-type: x mandatory;
          display: flex;
          flex-wrap: nowrap;
          transform: ${props.active ? "none" : "scale(0.75)"};
          filter: ${props.active ? "none" : "brightness(0.925)"};
          transition: transform 500ms, filter 500ms;
          z-index: ${props.active ? 0 : -1};
          transform-origin: center;
          &::-webkit-scrollbar {
            display: none;
          }
          scrollbar-width: 0;
        `}
        ref={scrollContainer}
      >
        <Spacer style={{ scrollSnapAlign: "start" }} data-direction="right" />
        <div
          className={css`
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            scroll-snap-align: center;
            flex-shrink: 0;
            margin-bottom: 1%;
          `}
        >
          {scrollTimeline && props.children(scrollTimeline)}
        </div>
        <Spacer style={{ scrollSnapAlign: "end" }} data-direction="left" />
      </div>
      <div
        className={css`
          position: absolute;
          transform: ${props.active ? "none" : "translateY(100%)"};
          opacity: ${props.active ? 1 : 0};
          pointer-events: none;
          transition: transform, opacity;
          transition-duration: 500ms;
          transition-delay: 200ms;
          bottom: 0;
          width: 100%;
          bottom: 2%;
        `}
      >
        <div
          className={css`
            justify-content: center;
            /* //width: 100%; */
            max-width: 500px;
            font-size: 1.5em;
            display: flex;
            margin: 0 auto;
          `}
        >
          <SwipeLink
            direction="left"
            timeline={scrollTimeline}
            scrollContainer={scrollContainer}
            style={{ pointerEvents: props.active ? "auto" : "none" }}
          >
            ❌
          </SwipeLink>
          <SwipeLink
            direction="right"
            timeline={scrollTimeline}
            scrollContainer={scrollContainer}
            style={{ pointerEvents: props.active ? "auto" : "none" }}
          >
            ✅
          </SwipeLink>
        </div>
      </div>
    </>
  );
}

const SwipeLink = ({
  direction,
  timeline,
  scrollContainer,
  ...props
}: {
  direction: "right" | "left";
  timeline: any;
  scrollContainer: RefObject<HTMLDivElement>;
} & ComponentProps<"a">) => {
  const isLeft = direction === "left";
  const ref = useRef<HTMLAnchorElement>(null);
  const transform = [
    "scale(0)",
    "scale(0.33)",
    "scale(1)",
    "scale(1.75)",
    "scale(2)",
  ];
  const opacity = [0, 0, 1, 1, 0];
  useEffect(() => {
    if (!timeline) {
      return;
    }
    ref.current?.animate(
      {
        transform: isLeft ? transform : transform.reverse(),
        opacity: isLeft ? opacity : opacity.reverse(),
      },
      {
        //@ts-ignore
        timeline,
      }
    );
  }, [timeline]);
  return (
    <a
      className={css`
        cursor: pointer;
        margin: 0 5%;
        text-align: center;
      `}
      ref={ref}
      onClick={() => {
        scrollContainer.current?.scrollTo({
          left: isLeft ? scrollContainer.current.scrollWidth : 0,
          behavior: "smooth",
        });
      }}
      {...props}
    />
  );
};

const Spacer = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={`${css`
      width: 125%;
      flex-shrink: 0;
      scroll-snap-align: end;
    `} ${className}}`}
    {...props}
  />
);
