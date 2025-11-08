# Law Contract Unified Design System

A comprehensive design system built with **Tailwind CSS only** - no external dependencies required. Features full RTL support and dark/light mode switching.

## 🎯 Key Features

- ✅ **Pure Tailwind CSS** - No external UI libraries
- ✅ **RTL Support** - Full right-to-left language support
- ✅ **Dark/Light Mode** - Automatic and manual theme switching
- ✅ **TypeScript** - Full type safety
- ✅ **Responsive** - Mobile-first design
- ✅ **Accessible** - WCAG compliant components
- ✅ **Customizable** - Easy to extend and modify

## 🎨 Design Tokens

### Colors

The design system uses HSL color values for better theme switching:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
}
```

### Dark Mode

Dark mode colors are automatically applied when `.dark` class is present:

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... more dark theme colors */
}
```

## 🧩 Components

### Button

Versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/components'

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// States
<Button isLoading>Loading</Button>
<Button disabled>Disabled</Button>
```

### Input

Form input component with validation and helper text.

```tsx
import { Input } from '@/components'

// Basic input
<Input placeholder="Enter your email" />

// With label and helper text
<Input 
  label="Email" 
  type="email" 
  placeholder="john@example.com" 
  helperText="We'll never share your email"
/>

// With error state
<Input 
  label="Password" 
  type="password" 
  error="Password must be at least 8 characters"
/>
```

### Card

Container component for grouping related content.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Badge

Small status indicators and labels.

```tsx
import { Badge } from '@/components'

// Variants
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### Alert

Notification and feedback messages.

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components'

<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your action was completed successfully.
  </AlertDescription>
</Alert>
```

## 🌙 Theme Management

### Theme Provider

Wrap your app with the ThemeProvider to enable theme switching:

```tsx
import { ThemeProvider } from '@/components'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Theme Toggle

Use the theme toggle components:

```tsx
import { ThemeToggle, DirectionToggle } from '@/components'

<ThemeToggle />      // Toggle between light/dark
<DirectionToggle />  // Toggle between LTR/RTL
```

### Manual Theme Control

```tsx
import { useTheme } from '@/components'

function MyComponent() {
  const { theme, direction, setTheme, setDirection } = useTheme()
  
  return (
    <div>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => setDirection('rtl')}>RTL</button>
    </div>
  )
}
```

## 🔄 RTL Support

### Automatic RTL Classes

The design system includes RTL-aware utility classes:

```tsx
// RTL-aware margin and padding
<div className="ms-4 me-2 ps-3 pe-1">
  {/* margin-inline-start: 1rem, margin-inline-end: 0.5rem */}
  {/* padding-inline-start: 0.75rem, padding-inline-end: 0.25rem */}
</div>

// RTL-aware borders
<div className="border-s border-e">
  {/* border-inline-start and border-inline-end */}
</div>

// RTL-aware border radius
<div className="rounded-s rounded-e-md">
  {/* border-start-* and border-end-* radius */}
</div>
```

### Manual RTL Styling

```tsx
import { conditionalRTL } from '@/utils/theme'

const marginLeft = conditionalRTL('ml-4', 'mr-4')
// Returns 'ml-4' for LTR, 'mr-4' for RTL
```

## 🛠️ Utilities

### Class Name Utility

Simple class name utility without external dependencies:

```tsx
import { cn } from '@/utils/cn'

// Conditional classes
<div className={cn(
  'base-class',
  isActive && 'active-class',
  variant === 'primary' && 'primary-class'
)} />

// RTL-aware classes
<div className={cn(
  'text-left',
  direction === 'rtl' && 'text-right'
)} />
```

### Size and Color Variants

```tsx
import { getSizeClasses, getColorClasses } from '@/utils/cn'

const sizeClass = getSizeClasses('md') // 'h-10 px-4 text-sm'
const colorClass = getColorClasses('primary') // 'bg-primary text-primary-foreground hover:bg-primary/90'
```

## 📱 Responsive Design

The design system is built mobile-first with responsive breakpoints:

- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up
- **xl**: 1280px and up
- **2xl**: 1536px and up

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Content</Card>
</div>
```

## 🎯 Best Practices

### Component Usage

1. **Consistency**: Always use the design system components
2. **Accessibility**: Components include proper ARIA attributes
3. **Responsive**: Use responsive utilities for mobile-first design
4. **Theming**: Components automatically adapt to themes

### RTL Development

1. **Use Logical Properties**: Prefer `ms-*`, `me-*`, `ps-*`, `pe-*` classes
2. **Test Both Directions**: Always test in both LTR and RTL
3. **Icon Flipping**: Use `rtl-flip` class for icons that need flipping
4. **Text Alignment**: Use `text-start` and `text-end` instead of `text-left` and `text-right`

### Theme Development

1. **Use CSS Variables**: Always use the design system's CSS variables
2. **Test Both Themes**: Test components in both light and dark modes
3. **Smooth Transitions**: Components include smooth theme transitions
4. **System Preference**: Respect user's system theme preference by default

## 🚀 Getting Started

1. **Install Dependencies**: Only Tailwind CSS is required
2. **Import Components**: Use components from `@/components`
3. **Wrap with Provider**: Add ThemeProvider to your app
4. **Start Building**: Use components with confidence

```tsx
import { Button, Input, Card, ThemeProvider } from '@/components'

function App() {
  return (
    <ThemeProvider>
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Input label="Name" placeholder="Enter your name" />
            <Button className="mt-4">Submit</Button>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  )
}
```

## 🔧 Customization

### Adding New Variants

```tsx
// In utils/cn.ts
export function getColorClasses(variant: 'primary' | 'custom') {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    custom: 'bg-purple-500 text-white hover:bg-purple-600',
  }
  return variants[variant]
}
```

### Custom CSS Variables

```css
/* In globals.css */
:root {
  --custom-color: 270 95% 60%;
}

.custom-component {
  background-color: hsl(var(--custom-color));
}
```

## 📚 File Structure

```
components/
├── ui/                    # UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── alert.tsx
│   └── index.ts
├── theme-provider.tsx     # Theme context
├── theme-toggle.tsx       # Theme controls
└── index.ts              # Main exports

utils/
├── cn.ts                 # Class name utilities
└── theme.ts              # Theme management

app/
├── globals.css           # Global styles and CSS variables
├── layout.tsx            # App layout with ThemeProvider
└── page.tsx              # Demo page

tailwind.config.ts        # Tailwind configuration with RTL support
```

This design system provides everything you need to build consistent, accessible, and beautiful user interfaces with full RTL and theme support using only Tailwind CSS.

