import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {},
  { callbacks: { authorized: ({ token }) => !!token }, pages: { signIn: '/admin/login' } }
)

export const config = { matcher: ["/admin/:path*"] }
