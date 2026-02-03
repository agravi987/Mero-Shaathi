import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/",
    "/subjects/:path*",
    "/notes/:path*",
    "/history/:path*",
    "/progress/:path*",
    "/revision/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};
