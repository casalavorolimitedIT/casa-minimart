// next-dev-toolbar — optional dev dep (safely skipped if not installed)
/* eslint-disable @typescript-eslint/no-require-imports */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _devWrap: (c: any) => any = (c: any) => c;
try {
  _devWrap = require("next-dev-toolbar/plugin").withDevToolbar();
} catch {}
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default _devWrap(nextConfig);
