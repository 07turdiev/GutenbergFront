# Mobile Browser Address Bar Theming Guide

## Overview
This guide explains how mobile browser address bar theming is implemented in this Next.js application.

## Implementation

### 1. Default Theme Color
The default theme color is set in `pages/_document.tsx`:

```tsx
<meta name="theme-color" content="#a62929" />
```

This color (`#a62929`) matches the primary brand color defined in `tailwind.config.js`.

### 2. Mobile Browser Support

#### Android Chrome
- Uses the `theme-color` meta tag
- Changes the address bar color to match your brand

#### iOS Safari
- `apple-mobile-web-app-capable`: Enables full-screen mode when added to home screen
- `apple-mobile-web-app-status-bar-style`: Sets the status bar appearance
  - `black-translucent`: Makes the status bar translucent with white text

#### Windows Phone (Legacy)
- `msapplication-navbutton-color`: Sets the navigation button color

### 3. Dynamic Theme Colors

You can override the default theme color on specific pages using the `HeadMeta` component:

```tsx
import HeadMeta from '@/components/HeadMeta'

export default function MyPage() {
  return (
    <>
      <HeadMeta 
        title="My Page"
        description="Page description"
        themeColor="#0d47a1" // Custom blue theme for this page
      />
      {/* Page content */}
    </>
  )
}
```

### 4. Supported Colors

- Use any valid CSS color format:
  - Hex: `#a62929`
  - RGB: `rgb(166, 41, 41)`
  - Named colors: `red`, `blue`

### 5. Best Practices

1. **Consistency**: Use colors from your design system (defined in `tailwind.config.js`)
2. **Contrast**: Ensure good contrast between the theme color and the status bar text
3. **Dark Mode**: Consider implementing dynamic theme colors for dark mode:

```tsx
const isDarkMode = useTheme() // Your dark mode hook
const themeColor = isDarkMode ? '#1a1a1a' : '#a62929'

<HeadMeta themeColor={themeColor} />
```

### 6. Testing

To test the mobile browser theming:

1. **Android Chrome**:
   - Open your site in Chrome on Android
   - The address bar should match your theme color

2. **iOS Safari**:
   - Open your site in Safari on iOS
   - Add the site to your home screen to see the full effect

3. **Chrome DevTools**:
   - Open DevTools (F12)
   - Toggle device toolbar (Ctrl+Shift+M)
   - Select a mobile device
   - You'll see a preview of the theme color in the address bar

### 7. Troubleshooting

- **Color not updating**: Clear browser cache and reload
- **iOS issues**: Ensure you're using a supported `apple-mobile-web-app-status-bar-style` value
- **Dynamic colors not working**: Check that the HeadMeta component is rendered before other content

### 8. Additional Resources

- [Chrome theme-color documentation](https://developers.google.com/web/updates/2014/11/support-for-theme-color-in-chrome-39-for-android)
- [Safari Web App documentation](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [MDN theme-color reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color) 