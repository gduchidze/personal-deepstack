# 🚀 DeepStack - AI Engineer Protocol Tracker

A professional, high-performance iOS app built with Expo and React Native for tracking a 65-week AI Engineering roadmap.

## 🎯 Features

### 📱 Dynamic UI/UX (Georgian Language)
- Pure Black (#000000) background with high-contrast accent colors
- Monospace fonts for "Terminal/Hacker" aesthetic
- Linear gradients with glowing effects around active components
- All UI labels in Georgian (ქართული)

## 🛠️ Technologies

- **Framework**: Expo + React Native + TypeScript
- **UI Libraries**:
  - `expo-linear-gradient` - Gradient effects
  - `lucide-react-native` - Icons
- **Notifications**: `expo-notifications`
- **Haptics**: `expo-haptics`
- **Storage**: `@react-native-async-storage/async-storage`
- **Date Management**: `date-fns`
- **Data Parsing**: `xlsx`

## 📂 Project Structure

```
DeepStack/
├── App.tsx                          # Main app component
├── assets/
│   └── AI_Engineer_15Month_Roadmap.xlsx  # Data source
├── src/
│   ├── components/
│   │   ├── CurrentActivityBlock.tsx  # Live time & activity display
│   │   ├── DailySchedule.tsx        # Day's full schedule
│   │   ├── ProgressLogger.tsx       # Logging & heatmap
│   │   └── RoadmapTracker.tsx       # Week progress & topics
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   └── utils/
│       ├── dataParser.ts            # XLSX parsing logic
│       ├── dateUtils.ts             # Date/time utilities
│       └── notifications.ts         # Notification scheduling
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)

### Installation

1. Navigate to the project directory:
```bash
cd DeepStack
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on iOS:
```bash
npm run ios
```

5. Run on Android:
```bash
npm run android
```

## 🎨 Design Philosophy

- **Pure Black Background**: #000000 for OLED optimization
- **Accent Colors**:
  - Green (#00ff41): Primary/Success
  - Blue (#00bfff): Info/Topics
  - Red (#ff6b6b): Urgent/Important
  - Orange (#ffa500): Progress/Stats
- **Typography**: Monospace fonts throughout for terminal aesthetic
- **Visual Effects**: Glowing borders, gradients, and subtle shadows


# 🚀 Quick Start Guide - DeepStack

## Running the Project Locally

### Step 1: Navigate to Project Directory
```bash
cd /Users/giorgiduchidze/PycharmProjects/personal-app/DeepStack
```

### Step 2: Start Expo Development Server
```bash
npm start
```

This will open the Expo Developer Tools in your browser.

### Step 3: Run on iOS Simulator (Recommended for iOS development)
```bash
npm run ios
```

Or press `i` in the terminal after running `npm start`

### Step 4: Run on Android Emulator
```bash
npm run android
```

Or press `a` in the terminal after running `npm start`

### Step 5: Run on Physical Device

1. After running `npm start`, a QR code will appear in the terminal
2. Install **Expo Go** app on your iOS/Android device:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
3. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

## 📱 Testing Features

### Notifications
1. Grant notification permissions when prompted
2. Notifications are scheduled automatically:
   - 07:30 - Wake up alert
   - 08:00 - Deep work start
   - 10:30 - Job 1 focus block
   - 12:15 - Standup meeting
   - 17:00 - Job 2 start
   - 20:00 - GYM time
   - 23:00 - Sleep reminder

### Progress Logging
1. Tap the "მონიშნე როგორც დასრულებული" button
2. Feel the haptic feedback
3. Check the heatmap at the bottom
4. View your streak counter

### Current Week Display
- The app automatically calculates which week you're in
- Program started: Feb 16, 2026 (Week 1)
- Shows current week's topics and activities

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web (for testing)
npm run web

# Clear cache and restart
npm start -- --clear
```

## 🔧 Troubleshooting

### Issue: "Module not found"
**Solution**: Clear cache and reinstall
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### Issue: iOS simulator not opening
**Solution**: Make sure Xcode is installed
```bash
xcode-select --install
```

### Issue: Notifications not working
**Solution**:
1. Check notification permissions in device settings
2. Restart the app
3. On iOS, notifications may not work in simulator - test on real device

### Issue: XLSX file not loading
**Solution**: The file is bundled at `./assets/AI_Engineer_15Month_Roadmap.xlsx`
Make sure it exists and hasn't been moved.

## 📊 Data Structure

The app reads from `AI_Engineer_15Month_Roadmap.xlsx` with these sheets:
- **Days**: Daily schedule (07:30 - 23:00)
- **65-Week Detailed Plan**: Roadmap topics and activities

## 🎨 UI Features to Test

1. **Current Activity Block**: Updates every second with current time and activity
2. **Roadmap Progress**: Shows Week X/65 with progress bar
3. **Daily Schedule**: Displays today's full schedule
4. **Heatmap**: Last 30 days of logged activities
5. **Dark Mode**: Pure black (#000000) background throughout

## ⚡ Performance Tips

- The app uses AsyncStorage for offline data persistence
- Schedule data is cached after first load
- Real-time clock updates every second
- Notifications are scheduled locally (no network needed)

## 📱 Best Experience

- iOS Device with notifications enabled
- Latest Expo Go app installed
- Good lighting to scan QR code
- WiFi connection for first load

---

**Ready to launch! 🚀**

Run `npm start` and begin your DeepStack journey!


## 📝 License

Private project for personal use.

