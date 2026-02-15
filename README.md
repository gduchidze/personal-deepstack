# 🚀 DeepStack - AI Engineer Protocol Tracker

A professional, high-performance iOS app built with Expo and React Native for tracking a 65-week AI Engineering roadmap.

## 🎯 Features

### 📱 Dynamic UI/UX (Georgian Language)
- Pure Black (#000000) background with high-contrast accent colors
- Monospace fonts for "Terminal/Hacker" aesthetic
- Linear gradients with glowing effects around active components
- All UI labels in Georgian (ქართული)

### 🔔 Protocol Engine & Notifications
- Local notifications for schedule transitions:
  - 07:30: "გაიღვიძე. დროა დაიწყო პროტოკოლი."
  - 08:00: "DEEP WORK: როუდმაპი დაიწყო. ტელეფონი გადადე!"
  - 10:30: "სამსახური 1: ფოკუს ბლოკი."
  - 12:15: "STANDUP: მოემზადე შეხვედრისთვის."
  - 17:00: "სამსახური 2: დაიწყე მუშაობა."
  - 20:00: "GYM: დროა ფიზიკური დატვირთვისთვის."
  - 23:00: "SLEEP: დაიძინე. ძილი მუშაობის ნაწილია."

### 📊 Roadmap Tracker
- Maps current week (based on program start: Feb 16, 2026)
- Displays daily tasks from the 65-week roadmap
- Progress circle showing completion percentage
- Week-by-week topic breakdown

### ✅ Interactive Logging
- "პროგრესის დალოგვა" button with haptic feedback
- Persistent storage using AsyncStorage
- Minimalist heatmap visualization
- Streak counter

### 📅 Daily Schedule
- Real-time schedule display
- Highlights current activity
- Special handling for Tue/Thu meetings and Wed/Sat/Sun GF time

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

## 📊 Data Format

The app reads from `AI_Engineer_15Month_Roadmap.xlsx` with the following sheets:

### Days Sheet
| დრო | ორშაბათი | სამშაბათი | ოთხშაბათი | ხუთშაბათი | პარასკევი | შაბათი | კვირა |
|-----|---------|----------|----------|----------|-----------|--------|-------|
| 07:30 | 🛌 ძილი | ... | ... | ... | ... | ... | ... |

### 65-Week Detailed Plan Sheet
| Week | Phase | Day | Time Block | Topic / Activity | DSA Practice | ... |
|------|-------|-----|------------|------------------|--------------|-----|
| Week 1 | Phase 1 | Mon | Block A | Karpathy Video 1 | ... | ... |

## 🎨 Design Philosophy

- **Pure Black Background**: #000000 for OLED optimization
- **Accent Colors**:
  - Green (#00ff41): Primary/Success
  - Blue (#00bfff): Info/Topics
  - Red (#ff6b6b): Urgent/Important
  - Orange (#ffa500): Progress/Stats
- **Typography**: Monospace fonts throughout for terminal aesthetic
- **Visual Effects**: Glowing borders, gradients, and subtle shadows

## 🔐 Permissions

The app requires the following permissions:
- **Notifications**: For schedule alerts
- **Haptics**: For tactile feedback

## 📝 License

Private project for personal use.

## 👨‍💻 Developer

Built with precision & discipline for the DeepStack Protocol Engine.

---

**Version**: 1.0.0
**Start Date**: February 16, 2026
**Duration**: 65 weeks
**End Date**: June 20, 2027
