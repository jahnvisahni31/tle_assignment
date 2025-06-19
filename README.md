# Student Progress Management System

A comprehensive web application for tracking and managing student progress through Codeforces competitive programming data. Built with React, TypeScript, and modern web technologies.


![Student Progress Management System](https://github.com/user-attachments/assets/4c66d3a5-93ef-4764-b969-21905363613d)
video link: https://youtu.be/yAAIyuUhpps
## 🚀 Features

### 📊 Dashboard
- **Real-time Analytics**: View comprehensive statistics including total students, average ratings, and activity metrics
- **Interactive Charts**: Beautiful visualizations using Recharts for rating trends, activity distribution, and problem-solving statistics
- **Live Data Sync**: Automatic synchronization with Codeforces API for up-to-date information

### 👥 Student Management
- **Complete Profiles**: Manage student information including contact details and Codeforces handles
- **Rating Tracking**: Monitor current and maximum ratings with color-coded ranking systems
- **Activity Status**: Track active/inactive students based on recent submission patterns
- **Bulk Operations**: Export student data to CSV and perform batch synchronization

### 📈 Individual Student Profiles
- **Detailed Analytics**: Comprehensive view of each student's progress and performance
- **Rating History**: Interactive charts showing rating progression over time
- **Submission Heatmaps**: Visual representation of daily coding activity
- **Recent Activity**: Timeline of contests participated and problems solved
- **Direct Codeforces Integration**: Quick links to student profiles on Codeforces

### ⚙️ Sync Management
- **Manual Synchronization**: Trigger immediate data updates for individual students or all students
- **Automatic Scheduling**: Configure periodic data synchronization intervals
- **Sync History**: Track synchronization success rates and identify issues
- **Rate Limiting**: Built-in protection against API rate limits

### 🎨 Modern UI/UX
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Polished interactions with hover effects and transitions
- **Accessibility**: WCAG compliant with proper focus management and screen reader support

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with enhanced IDE support
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React Router** - Client-side routing with nested routes
- **Recharts** - Responsive chart library built on D3
- **Lucide React** - Beautiful, customizable icons
- **Date-fns** - Modern date utility library

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting with TypeScript support
- **PostCSS** - CSS processing with Autoprefixer
- **TypeScript** - Static type checking

### API Integration
- **Codeforces API** - Real-time competitive programming data
- **Custom API Service** - Abstracted API calls with caching and error handling

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-progress-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🚀 Usage

### Adding Students

1. Navigate to the **Students** page
2. Click the **"Add Student"** button
3. Fill in the required information:
   - Full Name
   - Email Address
   - Phone Number (optional)
   - Codeforces Handle
4. Click **"Add Student"** to save

The system will automatically sync the student's Codeforces data upon creation.

### Managing Data Synchronization

#### Manual Sync
- **Individual Student**: Click the refresh icon on any student card
- **All Students**: Use the "Sync All Data" button on the Dashboard

#### Automatic Sync
1. Go to **Sync Settings**
2. Enable **"Automatic Sync"**
3. Configure the sync interval (30 minutes to 24 hours)

### Viewing Student Progress

1. Click on any student name to view their detailed profile
2. Explore different sections:
   - **Rating History**: Track rating changes over time
   - **Submission Activity**: View daily coding activity
   - **Recent Activity**: See latest contests and submissions

### Exporting Data

1. Go to the **Students** page
2. Use filters to select desired students
3. Click **"Export"** to download CSV file

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Application Configuration
VITE_APP_TITLE="Student Progress Management System"
VITE_API_BASE_URL="https://codeforces.com/api"

# Development
VITE_DEV_MODE=true
```

### Customization

#### Theme Configuration
Modify `tailwind.config.js` to customize colors, fonts, and spacing:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom color palette
        }
      }
    }
  }
}
```

#### API Configuration
Update `src/services/codeforcesApi.ts` to modify:
- Cache timeout duration
- Rate limiting delays
- API endpoints

## 📊 API Integration

### Codeforces API Endpoints Used

- **User Information**: `/user.info?handles={handles}`
- **User Submissions**: `/user.status?handle={handle}`
- **Rating History**: `/user.rating?handle={handle}`

### Rate Limiting

The application implements intelligent rate limiting:
- 500ms delay between sequential requests
- Caching with 5-minute timeout
- Graceful error handling for API failures

### Data Processing

Student data is processed to provide:
- Current and maximum ratings
- Activity status based on recent submissions
- Contest participation history
- Problem-solving statistics

## 🎨 UI Components

### Reusable Components

- **StudentCard**: Displays student information with rating and status
- **AddStudentModal**: Form for adding new students
- **Charts**: Rating history, activity heatmaps, and statistics
- **Layout**: Navigation and theme management

### Styling System

- **Consistent Design**: 8px spacing system throughout
- **Color System**: Comprehensive color ramps for different states
- **Typography**: Inter font with proper hierarchy
- **Responsive**: Mobile-first approach with breakpoints

## 🔍 Troubleshooting

### Common Issues

#### API Rate Limiting (HTTP 429)
- **Cause**: Too many concurrent requests to Codeforces API
- **Solution**: The app automatically handles this with sequential requests and delays

#### Student Data Not Syncing
- **Check**: Verify the Codeforces handle is correct
- **Try**: Manual sync using the refresh button
- **Note**: Some handles may not exist or be private

#### Theme Not Persisting
- **Check**: Browser local storage permissions
- **Clear**: Browser cache and reload

### Performance Optimization

- **Lazy Loading**: Components load on demand
- **Memoization**: Expensive calculations are cached
- **Efficient Rendering**: React.memo and useMemo prevent unnecessary re-renders

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards

- **TypeScript**: All new code must be typed
- **ESLint**: Follow the configured linting rules
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes, avoid custom CSS

### Testing

```bash
# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Codeforces** - For providing the comprehensive API
- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon set
- **Recharts** - For the responsive charting library

## 📞 Support

For support, questions, or feature requests:

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@yourproject.com

---

<div align="center">
  <p>Built with ❤️ for the competitive programming community</p>
  <p>
    <a href="#-features">Features</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-usage">Usage</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>
