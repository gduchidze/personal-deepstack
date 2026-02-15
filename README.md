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

## 📝 License

Private project for personal use.

