# Push Notifications Setup for iOS

This app implements local push notifications to remind users to check in at 6AM and 6PM daily.

## Features

- **Morning Check-in Reminder**: Notification at 6:00 AM daily
- **Evening Check-in Reminder**: Notification at 6:00 PM daily
- **iOS Native Integration**: Uses Capacitor Local Notifications plugin

## Setup Instructions

### 1. Install Dependencies

The Local Notifications plugin has already been installed:

```bash
npm install @capacitor/local-notifications
```

### 2. Sync Capacitor

After making changes, sync the Capacitor project:

```bash
npm run build
npx cap sync
```

### 3. Open in Xcode

```bash
npx cap open ios
```

### 4. Configure iOS Capabilities

In Xcode, you need to enable push notifications:

1. Select your project in the navigator
2. Select the **App** target
3. Go to the **Signing & Capabilities** tab
4. Click **+ Capability**
5. Add **Push Notifications**
6. Add **Background Modes** and enable **Remote notifications**

### 5. Build and Run

Build the app in Xcode and run it on your iOS device or simulator.

On first launch, the app will request notification permissions from the user.

## How It Works

1. When the app loads, `useNotifications()` hook is called in `App.tsx`
2. The hook requests notification permissions from the user
3. If granted, it schedules two daily repeating notifications:
   - Morning: 6:00 AM
   - Evening: 6:00 PM
4. Notifications are persistent and will continue to fire even when the app is closed

## Testing Notifications

### On iOS Simulator

Local notifications work on iOS simulator. You can adjust the system time to test them.

### On Real Device

1. Install the app on your device
2. Grant notification permissions when prompted
3. Wait for the scheduled time or adjust your device's system time

## Troubleshooting

### Notifications not appearing

1. Check that notification permissions were granted
2. Verify iOS Capabilities are enabled in Xcode
3. Check iOS Settings > TidalHack > Notifications
4. Ensure the app is allowed to send notifications

### Building errors

If you encounter issues with the iOS project:

```bash
cd ios/App
export LANG=en_US.UTF-8
pod install
```

Then rebuild in Xcode.

## Customization

To change notification times or messages, edit `frontend/src/hooks/useNotifications.ts`:

```typescript
// Change notification times
on: {
  hour: 6,   // Change to desired hour (0-23)
  minute: 0, // Change to desired minute (0-59)
}

// Change notification text
title: 'Time for your morning check-in! 🌅',
body: 'Share how you\'re feeling and stay on track',
```

## Additional Resources

- [Capacitor Local Notifications Documentation](https://capacitorjs.com/docs/apis/local-notifications)
- [Capacitor iOS Configuration](https://capacitorjs.com/docs/ios/configuration)
