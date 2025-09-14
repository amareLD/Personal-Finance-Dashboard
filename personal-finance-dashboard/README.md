# Personal Finance Dashboard 💰

A modern, responsive personal finance management application built with Next.js 15, featuring comprehensive transaction tracking, budget management, analytics, and savings goals with dark mode support.

## 🌟 Project Overview and Features

The Personal Finance Dashboard is a comprehensive web application designed to help users manage their personal finances effectively. It provides a clean, intuitive interface for tracking income, expenses, budgets, and financial goals.

### Key Features

- **📊 Dashboard Overview**: Real-time financial summary with key metrics
- **💳 Transaction Management**: Add, edit, delete, and categorize transactions
- **📈 Budget Planning**: Create and monitor budgets with visual progress tracking
- **🎯 Savings Goals**: Set and track progress toward financial goals
- **📊 Analytics & Charts**: Visual insights with interactive charts and graphs
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🌙 Dark Mode**: Toggle between light and dark themes
- **📤 CSV Import/Export**: Import transactions from CSV files and export data
- **⚡ Real-time Updates**: Instant feedback and live data updates
- **🎨 Modern UI**: Clean, professional interface with smooth animations

## 🚀 Setup and Installation Instructions

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/amareLD/Personal-Finance-Dashboard.git
   cd Personal-Finance-Dashboard/personal-finance-dashboard
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
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome

## 🛠️ Technology Stack Used

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React version with improved features
- **React DOM 19** - React rendering library

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Tailwind Merge** - Utility for merging Tailwind classes
- **Lucide React** - Beautiful icon library
- **Headless UI** - Accessible UI components

### Data Visualization
- **Recharts** - Composable charting library for React

### Development Tools
- **Biome** - Fast linter and formatter
- **PostCSS** - CSS transformation tool
- **Turbopack** - Fast bundler for development

### Utilities
- **clsx** - Utility for constructing className strings
- **date-fns** - Modern JavaScript date utility library

## 📁 Folder Structure Explanation

```
personal-finance-dashboard/
├── 📄 biome.json                    # Biome configuration
├── 📄 jsconfig.json                 # JavaScript configuration
├── 📄 next.config.mjs               # Next.js configuration
├── 📄 package.json                  # Project dependencies and scripts
├── 📄 postcss.config.mjs            # PostCSS configuration
├── 📄 README.md                     # Project documentation
├── 📄 transaction.csv               # Sample transaction data
├── 📁 public/                       # Static assets
│   ├── 🖼️ file.svg                 # File icon
│   ├── 🖼️ globe.svg                # Globe icon
│   ├── 🖼️ next.svg                 # Next.js logo
│   ├── 🖼️ vercel.svg               # Vercel logo
│   └── 🖼️ window.svg               # Window icon
└── 📁 src/                          # Source code
    ├── 📁 app/                       # Next.js App Router pages
    │   ├── 📄 favicon.ico           # App favicon
    │   ├── 📄 globals.css           # Global styles
    │   ├── 📄 layout.js             # Root layout
    │   ├── 📄 page.js               # Home page (Dashboard)
    │   ├── 📁 analytics/            # Analytics page
    │   ├── 📁 budget/               # Budget management page
    │   ├── 📁 savings/              # Savings goals page
    │   └── 📁 transactions/         # Transaction management page
    ├── 📁 components/                # Reusable React components
    │   ├── 📁 analytics/            # Chart and analytics components
    │   ├── 📁 budget/               # Budget-related components
    │   ├── 📁 dashboard/            # Dashboard overview components
    │   ├── 📁 layout/               # Layout and navigation components
    │   ├── 📁 savings/              # Savings goal components
    │   ├── 📁 transactions/         # Transaction management components
    │   └── 📁 ui/                   # Base UI components (buttons, cards, etc.)
    ├── 📁 hooks/                     # Custom React hooks
    │   └── 📄 useData.js            # Data management hooks
    └── 📁 lib/                       # Utility functions and constants
        ├── 📄 constants.js          # App constants
        └── 📄 utils.js              # Helper functions
```

## 📸 Screenshots of Key Features

### 🏠 Dashboard Overview
![Dashboard Overview](https://via.placeholder.com/800x600/1f2937/ffffff?text=Dashboard+Overview)
*Main dashboard showing financial summary, recent transactions, and key metrics*

### 💳 Transaction Management
![Transaction Management](https://via.placeholder.com/800x600/1f2937/ffffff?text=Transaction+Management)
*Comprehensive transaction tracking with filtering and categorization*

### 📊 Budget Planning
![Budget Planning](https://via.placeholder.com/800x600/1f2937/ffffff?text=Budget+Planning)
*Visual budget management with progress tracking and alerts*

### 🎯 Savings Goals
![Savings Goals](https://via.placeholder.com/800x600/1f2937/ffffff?text=Savings+Goals)
*Set and track progress toward financial savings goals*

### 📈 Analytics & Charts
![Analytics Dashboard](https://via.placeholder.com/800x600/1f2937/ffffff?text=Analytics+%26+Charts)
*Interactive charts and financial insights*

### 🌙 Dark Mode
![Dark Mode](https://via.placeholder.com/800x600/374151/ffffff?text=Dark+Mode+Interface)
*Beautiful dark mode interface for comfortable viewing*

## 🌐 Live Demo Link

**🚀 [View Live Demo](https://personal-finance-dashboard-demo.vercel.app)**

*Experience the full functionality of the Personal Finance Dashboard with sample data*

## 🎯 Getting Started

1. **Dashboard**: Start by exploring the main dashboard to get an overview of your finances
2. **Add Transactions**: Use the Transactions page to add your income and expenses
3. **Set Budgets**: Create budgets for different categories to track spending
4. **Savings Goals**: Set up savings goals to track your progress
5. **Analytics**: View detailed charts and insights about your financial patterns

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you have any questions or need support, please open an issue on GitHub.

---

Built with ❤️ using Next.js 15 and Tailwind CSS
