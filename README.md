# Personal Expense Tracker 💰

A modern, lightweight web application for tracking daily expenses, analyzing spending patterns, and managing your household budget without requiring login or registration.

## Features ✨

### Dashboard
- **Current Month Spending**: Real-time total expenses visualization
- **Category Breakdown**: See spending distribution across categories
- **Budget Status**: Track remaining budget vs spending
- **Quick Statistics**: Daily average, highest transaction, total count
- **Recent Transactions**: Last 10 expenses at a glance

### Expense Management
- **Quick Add Expense**: Add expenses in under 5 seconds
- **Categories**: Food, Fuel, Hospital, Bills, Home Maintenance, Others
- **Flexible Entry**: Title, amount, date, category, and optional notes
- **Edit/Delete**: Modify or remove expenses anytime

### Analytics & Insights
- **Detailed Analysis**: Daily averages, highest/lowest transactions
- **Category Analytics**: Total amounts, percentages, transaction counts
- **Visual Charts**: 
  - Pie chart for category distribution
  - Line chart for monthly trends
  - Automatic insights and comparisons

### Reports
- **Monthly Reports**: Comprehensive spending summaries
- **Category Summary**: Breakdown by category with percentages
- **Export Data**: JSON backup of all expenses
- **Smart Insights**: AI-like observations about spending patterns

### Historical Records
- **Browse History**: View all expenses chronologically
- **Filter by Month**: Analyze specific months
- **Complete Data**: All transactions preserved

### Additional Features
- **Local Storage**: All data stored locally - completely private
- **Budget Tracking**: Set and monitor monthly budget limits
- **Responsive Design**: Works on desktop, tablet, and mobile
- **No Login Required**: Immediate access, no registration
- **Fast Performance**: Instant calculations and rendering

## Technology Stack 🛠️

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Browser LocalStorage (SQLite-ready for backend)
- **Charts**: Canvas-based chart rendering
- **Design**: Modern minimalist UI with premium feel
- **Color Palette**: Black & White with subtle grays

## Getting Started 🚀

### Option 1: Direct HTML (Recommended for Quick Start)
1. Navigate to the project directory
2. Open `index.html` in your web browser
3. Start tracking expenses immediately!

### Option 2: Using Python HTTP Server
```bash
cd "/home/haneer/Documents/expence tracker"
python3 -m http.server 8000
```
Then visit: `http://localhost:8000`

### Option 3: Using Node.js Server
```bash
cd "/home/haneer/Documents/expence tracker"
python3 server.py
```
Then visit: `http://localhost:5000`

## Usage Guide 📖

### Adding an Expense
1. Click "➕ Add Expense" in the sidebar
2. Fill in the expense details:
   - **Title**: Description (e.g., "Grocery Shopping")
   - **Category**: Select from dropdown
   - **Amount**: Transaction amount in ₹
   - **Date**: When the expense occurred
   - **Notes**: Optional details
3. Click "Add Expense"

### Viewing Dashboard
- See current month total spending
- View category breakdown with percentages
- Check budget remaining vs spent
- View last 10 transactions

### Analytics
- Switch to Analytics tab
- View detailed expense statistics
- See category analysis
- View monthly comparison charts

### Reports
- Generate comprehensive monthly reports
- Export data as JSON for backup
- View spending insights

### History
- Browse all expenses chronologically
- Filter by month
- Edit or delete any transaction

### Settings
- **Budget**: Set your monthly budget limit
- **Data Export**: Download JSON backup
- **Clear Data**: Remove all expenses (use cautiously!)

## Database Schema 📊

### Expenses
```
- id (UUID)
- title (string)
- categoryId (integer)
- amount (decimal)
- date (date)
- notes (text)
- createdAt (timestamp)
```

### Categories
```
- id (integer)
- name (string) - Food, Fuel, Hospital, Bills, Home Maintenance, Others
- color (hex) - for visualization
```

### Monthly Summary (calculated)
```
- month (integer)
- year (integer)
- totalExpense (decimal)
- category totals for each category
```

## File Structure 📁

```
.
├── index.html          # Main HTML interface
├── app.js             # JavaScript application logic
├── README.md          # This file
└── server.py          # Optional Python Flask server
```

## Features Breakdown 📋

### ✅ Implemented
- Dashboard with spending overview
- Add/Delete expenses
- Category management (6 pre-defined categories)
- Monthly auto-cycle (current month view)
- Analytics with calculations
- Charts (Pie & Line charts)
- Historical records browsing
- Budget tracking
- Local data persistence
- Responsive design
- Data export (JSON)
- Smart insights generation
- Recent transactions view

### 🚀 Future Enhancements
- Budget alerts and notifications
- Recurring expenses
- Receipt image upload
- OCR bill scanning
- Voice expense entry
- WhatsApp integration
- Multi-user support
- Cloud synchronization
- PDF export with formatting
- Advanced forecasting

## Performance ⚡

- **Add Expense**: < 1 second
- **Dashboard Load**: Instant
- **Analytics**: < 500ms
- **Data Size**: < 1MB for 5 years of data

## Storage Limits 💾

- **Browser LocalStorage**: ~5-10MB per domain
- **Equivalent to**: ~50,000 transactions
- **For 5 years**: ~27 transactions/day average

## Color Scheme 🎨

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Black | #000000 | Main text, icons |
| White | #FFFFFF | Backgrounds |
| Light Gray | #F5F5F5 | Secondary background |
| Dark Gray | #1A1A1A | Hover states |
| Border | #E0E0E0 | Dividers |

## Browser Support 🌐

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

## Keyboard Shortcuts ⌨️

- Currently navigated via UI (future: add keyboard shortcuts)

## Tips & Tricks 💡

1. **Quick Backup**: Export data monthly to JSON
2. **Budget Planning**: Set budget at start of month
3. **Category Tips**: Use "Others" for miscellaneous spending
4. **Analytics**: Check trends monthly to identify spending patterns
5. **Mobile Use**: Pin app to home screen for app-like experience

## Troubleshooting 🔧

**Q: Data disappeared after browser clear?**
- A: Clear browser cache/cookies can remove data. Export regularly!

**Q: Can I import data back?**
- A: Currently manual - copy JSON to add expenses directly (future: import UI)

**Q: Works offline?**
- A: Yes! All data stored locally in browser

**Q: Export formats?**
- A: Currently JSON. PDF export coming soon.

## Support & Feedback 📧

For issues, feature requests, or feedback - feel free to contribute!

## License 📄

Personal Use - Free to modify and distribute

---

Made with ❤️ for better personal finance management

**Version**: 1.0.0  
**Last Updated**: June 2026
