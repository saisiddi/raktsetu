import { BASE_URL } from "@/lib/config";

export default function sitemap() {
  const routes = [
    "",
    "/blood-banks",
    "/request",
    "/donate",
    "/donors",
    "/compatibility",
    "/about",
    "/privacy",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
