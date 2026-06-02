import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "اقتداء | يومك على السنة",
    short_name: "اقتداء",
    description: "تطبيق يساعدك على معرفة ما ثبت عن النبي ﷺ في مواقف يومك وتطبيق السنن الصحيحة خطوة بخطوة مع الدليل والمصدر.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0a120e",
    theme_color: "#1b4d3e",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
