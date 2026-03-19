import useSmoothScroll from "./hooks/useSmoothScroll";

export default function RootLayout({ children }) {
  useSmoothScroll();

  return children;
}
