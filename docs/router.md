# Routing Architecture (@exhuma/router)

`@exhuma/router` provides production-ready layout framing, navigation bars, and route guards.

---

## `<LandingLayout>`

Root marketing page layout with sticky header and footer slots:

```tsx
import { LandingLayout, Header, Footer } from '@exhuma/router';

export default function Layout({ children }) {
  return (
    <LandingLayout
      header={<Header brand="Exhuma" />}
      footer={<Footer brand="Exhuma Studio" />}
    >
      {children}
    </LandingLayout>
  );
}
```

---

## `<AuthLayout>`

Login and signup framing supporting single-card and split-screen hero layouts:

```tsx
import { AuthLayout } from '@exhuma/router';

<AuthLayout split={true} title="Sign In" subtitle="Welcome back">
  <LoginForm />
</AuthLayout>
```

---

## `<DashboardLayout>`

Application workspace layout with collapsible sidebar, utility header, and breadcrumb rail.
