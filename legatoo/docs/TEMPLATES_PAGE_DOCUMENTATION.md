# Templates Page - Complete Documentation

## Overview

The Templates Page (`/dashboard/templates`) is a comprehensive legal contract templates library interface that allows users to browse, search, filter, and use legal document templates. The page supports both English and Arabic (RTL) languages and provides a modern, user-friendly interface for template management.

**File Location:** `app/dashboard/templates/page.tsx`

---

## Table of Contents

1. [Page Structure](#page-structure)
2. [Components & Features](#components--features)
3. [Data Structure](#data-structure)
4. [Functionality](#functionality)
5. [UI/UX Elements](#uiux-elements)
6. [Localization Support](#localization-support)
7. [State Management](#state-management)
8. [Styling & Design](#styling--design)
9. [Backend Integration Requirements](#backend-integration-requirements)
10. [Implementation Checklist](#implementation-checklist)

---

## Page Structure

The Templates Page is built as a client-side React component wrapped within the `DashboardLayout` component. It consists of the following main sections:

### 1. Header Section
- **Title:** "Templates Library" / "مكتبة القوالب"
- **Description:** "Comprehensive collection of legal contract templates"
- **Action Button:** "Add New Template" / "إضافة قالب جديد"

### 2. Statistics Cards (4 Cards)
- Total Templates
- Total Downloads
- Average Rating
- Available Categories

### 3. Categories Filter Section
- Category filter buttons with counts
- Active category highlighting

### 4. Search & Filter Section
- Search input field
- Filter button

### 5. Templates Grid
- Responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
- Template cards with detailed information

### 6. Popular Templates Section
- List of top 5 most downloaded templates

---

## Components & Features

### 1. Header Component

**Location:** Lines 112-128

```12:128:app/dashboard/templates/page.tsx
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'مكتبة القوالب' : 'Templates Library'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isRTL ? 'مجموعة شاملة من قوالب العقود القانونية' : 'Comprehensive collection of legal contract templates'}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'إضافة قالب جديد' : 'Add New Template'}
            </button>
          </div>
        </div>
```

**Features:**
- Responsive layout (stacked on mobile, side-by-side on desktop)
- RTL support with conditional styling
- "Add New Template" button (currently non-functional - needs implementation)

**TODO:**
- Connect "Add New Template" button to modal/form
- Implement template creation workflow

---

### 2. Statistics Cards

**Location:** Lines 130-203

**Cards Displayed:**

1. **Total Templates Card** (Lines 132-148)
   - Icon: `Library` (blue)
   - Stat: Hardcoded value `156`
   - Label: "Total Templates" / "إجمالي القوالب"

2. **Total Downloads Card** (Lines 150-166)
   - Icon: `Download` (green)
   - Stat: Hardcoded value `2,847`
   - Label: "Total Downloads" / "إجمالي التحميلات"

3. **Average Rating Card** (Lines 168-184)
   - Icon: `Star` (yellow)
   - Stat: Hardcoded value `4.6`
   - Label: "Average Rating" / "متوسط التقييم"

4. **Available Categories Card** (Lines 186-202)
   - Icon: `Tag` (purple)
   - Stat: Hardcoded value `12`
   - Label: "Available Categories" / "الفئات المتاحة"

**Features:**
- Responsive grid (1 column mobile, 4 columns desktop)
- Color-coded icons for visual distinction
- RTL support for proper alignment

**TODO:**
- Connect to backend API to fetch real statistics
- Implement dynamic data updates

---

### 3. Categories Filter Section

**Location:** Lines 205-232

**Categories Defined:**
- All (default)
- Employment / التوظيف
- Confidentiality / السرية
- Service / الخدمات
- Commercial / التجارية

**Features:**
- Dynamic category counts based on templates array
- Active category highlighting with primary color
- Category badges showing count
- Click handler to filter templates

**Current Implementation:**
```82:88:app/dashboard/templates/page.tsx
  const categories = [
    { id: 'all', name: isRTL ? 'الكل' : 'All', count: templates.length },
    { id: 'Employment', name: isRTL ? 'التوظيف' : 'Employment', count: templates.filter(t => t.category === 'Employment').length },
    { id: 'Confidentiality', name: isRTL ? 'السرية' : 'Confidentiality', count: templates.filter(t => t.category === 'Confidentiality').length },
    { id: 'Service', name: isRTL ? 'الخدمات' : 'Service', count: templates.filter(t => t.category === 'Service').length },
    { id: 'Commercial', name: isRTL ? 'التجارية' : 'Commercial', count: templates.filter(t => t.category === 'Commercial').length }
  ];
```

**TODO:**
- Fetch categories from backend API
- Add support for dynamic categories
- Add category creation/editing functionality

---

### 4. Search & Filter Section

**Location:** Lines 234-257

**Features:**
- Search input with icon
- RTL support for Arabic text input
- Filter button (currently non-functional)
- Responsive layout

**Current Implementation:**
- Search input is present but not connected to filtering logic
- Filter button exists but has no functionality

**TODO:**
- Implement search functionality to filter templates by title, description, or tags
- Add advanced filter modal/dropdown with options:
  - Filter by rating
  - Filter by file format
  - Filter by date range
  - Filter by favorites
  - Filter by premium/free

---

### 5. Template Card Component

**Location:** Lines 260-343 (Templates Grid)

**Template Card Structure:**

Each template card displays:

1. **Header Section:**
   - Icon (FileText in blue circle)
   - Title
   - Category badge (color-coded)
   - Favorite star button

2. **Content Section:**
   - Description (2 lines max with truncation)

3. **Metadata Section:**
   - Last modified date with Calendar icon
   - Download count with Download icon

4. **Rating Section:**
   - Star rating display
   - File size and format

5. **Tags Section:**
   - Up to 3 visible tags
   - "+X more" indicator if more than 3 tags

6. **Action Buttons:**
   - Preview button (Eye icon)
   - Use button (Copy icon)

**Template Data Structure:**
```27:80:app/dashboard/templates/page.tsx
  const templates = [
    {
      id: 1,
      title: "Employment Agreement Template",
      category: "Employment",
      description: "Standard employment agreement with customizable terms",
      lastModified: "2024-01-20",
      downloads: 245,
      rating: 4.8,
      tags: ["employment", "contract", "hr"],
      isFavorite: true,
      fileSize: "2.3 MB",
      format: "DOCX"
    },
    // ... more templates
  ];
```

**Category Color Mapping:**
```90:103:app/dashboard/templates/page.tsx
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Employment':
        return 'bg-blue-100 text-blue-800';
      case 'Confidentiality':
        return 'bg-purple-100 text-purple-800';
      case 'Service':
        return 'bg-green-100 text-green-800';
      case 'Commercial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
```

**Features:**
- Hover effects (shadow elevation)
- Responsive grid layout
- RTL support
- Favorite toggle (visual only, not functional)
- Preview and Use buttons (non-functional)

**TODO:**
- Connect to backend API for template data
- Implement favorite toggle functionality
- Implement Preview button (open template preview modal)
- Implement Use button (copy template or open editor)
- Add loading states
- Add empty state when no templates match filters
- Implement pagination or infinite scroll for large datasets

---

### 6. Popular Templates Section

**Location:** Lines 345-375

**Features:**
- Displays top 5 templates by download count
- Shows ranking number (1-5) in colored circle
- Displays title, download count, and rating
- Shows category badge
- Sorted by downloads descending

**Current Implementation:**
```350:374:app/dashboard/templates/page.tsx
          <div className="space-y-3">
            {templates
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 5)
              .map((template, index) => (
                <div key={template.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className={`ml-3 ${isRTL ? 'mr-3 ml-0 text-right' : 'text-left'}`}>
                      <div className="text-sm font-medium text-gray-900">
                        {template.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {template.downloads} {isRTL ? 'تحميل' : 'downloads'} • {template.rating} ⭐
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
              ))}
          </div>
```

**TODO:**
- Add click handler to navigate to template detail
- Connect to backend API for popular templates
- Add refresh/update functionality

---

## Data Structure

### Template Object Schema

```typescript
interface Template {
  id: number;
  title: string;
  category: string;
  description: string;
  lastModified: string; // ISO date string
  downloads: number;
  rating: number; // 0-5 scale
  tags: string[];
  isFavorite: boolean;
  fileSize: string;
  format: string; // "DOCX", "PDF", etc.
}
```

### Category Object Schema

```typescript
interface Category {
  id: string;
  name: string; // Localized name
  count: number;
}
```

### Current Mock Data

**Templates:** 4 mock templates are defined (lines 27-80)
- Employment Agreement Template
- Non-Disclosure Agreement (NDA)
- Service Level Agreement
- Purchase Agreement Template

**Note:** All data is currently hardcoded and needs to be replaced with API calls.

---

## Functionality

### Implemented Features

✅ **Category Filtering**
- Filter templates by category
- Update template grid based on selected category
- Active category highlighting

✅ **RTL Support**
- Full bidirectional text support
- Proper layout mirroring for Arabic
- Input direction handling

✅ **Responsive Design**
- Mobile-first approach
- Breakpoints: mobile (1 col), tablet (2 cols), desktop (3 cols)
- Flexible statistics cards grid

✅ **Visual Feedback**
- Hover effects on cards
- Active state styling for filters
- Color-coded categories

### Missing/Incomplete Features

❌ **Backend Integration**
- No API calls to fetch templates
- No API calls to fetch statistics
- No API calls to fetch categories
- No real-time data updates

❌ **Search Functionality**
- Search input exists but doesn't filter templates
- No search debouncing
- No search suggestions

❌ **Filter Functionality**
- Filter button exists but has no action
- No advanced filtering options
- No sort options

❌ **Template Actions**
- Preview button not functional
- Use button not functional
- Favorite toggle doesn't save state
- No download functionality

❌ **Template Management**
- Add New Template button not functional
- No edit template functionality
- No delete template functionality

❌ **User Interactions**
- No loading states
- No error states
- No empty states
- No pagination

---

## UI/UX Elements

### Icons Used (from lucide-react)

- `Library` - Total templates stat
- `Plus` - Add new template button
- `Search` - Search input icon
- `Filter` - Filter button icon
- `Download` - Downloads stat & template downloads
- `Eye` - Preview button
- `Edit3` - (Imported but not used)
- `FileText` - Template icon
- `Calendar` - Last modified date
- `Tag` - Categories stat
- `Star` - Rating display & favorite toggle
- `Copy` - Use template button

### Color Scheme

**Category Colors:**
- Employment: Blue (`bg-blue-100 text-blue-800`)
- Confidentiality: Purple (`bg-purple-100 text-purple-800`)
- Service: Green (`bg-green-100 text-green-800`)
- Commercial: Orange (`bg-orange-100 text-orange-800`)

**Stat Card Icons:**
- Templates: Blue (`text-blue-600`)
- Downloads: Green (`text-green-600`)
- Rating: Yellow (`text-yellow-600`)
- Categories: Purple (`text-purple-600`)

**Primary Actions:**
- Primary button: `bg-primary` (uses theme primary color)
- Secondary button: `bg-white border-gray-300`

### Typography

- Page Title: `text-2xl font-bold`
- Section Titles: `text-lg font-medium`
- Card Titles: `text-sm font-medium`
- Descriptions: `text-sm text-gray-500`
- Stats: `text-lg font-medium`

### Spacing & Layout

- Section spacing: `space-y-6`
- Card padding: `p-6`
- Grid gaps: `gap-6`
- Button padding: `px-4 py-2` (primary), `px-3 py-2` (secondary)

---

## Localization Support

### Supported Languages

- **English (en)** - Default, LTR
- **Arabic (ar)** - RTL support

### Translation Keys Used

The page uses hardcoded strings that should be moved to translation files:

**English:**
- "Templates Library"
- "Comprehensive collection of legal contract templates"
- "Add New Template"
- "Total Templates"
- "Total Downloads"
- "Average Rating"
- "Available Categories"
- "Categories"
- "Search templates..."
- "Filter"
- "Preview"
- "Use"
- "Most Popular Templates"
- "downloads"

**Arabic:**
- "مكتبة القوالب"
- "مجموعة شاملة من قوالب العقود القانونية"
- "إضافة قالب جديد"
- "إجمالي القوالب"
- "إجمالي التحميلات"
- "متوسط التقييم"
- "الفئات المتاحة"
- "الفئات"
- "البحث في القوالب..."
- "تصفية"
- "عرض"
- "استخدام"
- "القوالب الأكثر شعبية"
- "تحميل"

### RTL Implementation

The page uses conditional styling based on `isRTL`:

```typescript
const isRTL = locale === 'ar';
```

**RTL Styling Patterns:**
- Flex direction: `flex-row-reverse`
- Margin: `ml-2` → `mr-2` (and vice versa)
- Text alignment: `text-right`
- Input direction: `dir="rtl"`

**TODO:**
- Move all hardcoded strings to translation files
- Use `useTranslation` hook for all text content
- Ensure all new features support RTL

---

## State Management

### Current State Variables

```typescript
const [selectedCategory, setSelectedCategory] = useState('all');
```

**State:**
- `selectedCategory`: Currently selected category filter (default: 'all')

### Derived State

- `filteredTemplates`: Computed from `templates` array based on `selectedCategory`
- `categories`: Computed from `templates` array with counts
- `isRTL`: Derived from `locale` from `useTranslation` hook

### State Management TODO

❌ **Missing State:**
- Search query state
- Filter state (rating, format, date, etc.)
- Loading state
- Error state
- Templates data state (currently hardcoded)
- Statistics data state (currently hardcoded)
- Favorites state (not persisted)
- Selected template state (for preview/modal)
- Pagination state (page, pageSize)

❌ **Recommended State Management:**
- Consider using React Query or SWR for server state
- Use Context API for global template-related state
- Implement optimistic updates for favorites
- Add error boundary for error handling

---

## Styling & Design

### Tailwind CSS Classes Used

**Layout:**
- `flex`, `flex-col`, `flex-row`, `flex-wrap`
- `grid`, `grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-3`, `md:grid-cols-4`
- `space-y-6`, `gap-6`, `gap-4`, `gap-2`

**Spacing:**
- `p-6`, `p-5`, `p-3`, `px-4`, `py-2`, `px-3`, `py-2`
- `mt-4`, `mt-1`, `ml-2`, `mr-2`

**Typography:**
- `text-2xl`, `text-lg`, `text-sm`, `text-xs`
- `font-bold`, `font-medium`
- `text-gray-900`, `text-gray-700`, `text-gray-600`, `text-gray-500`
- `truncate`, `line-clamp-2`

**Colors & Backgrounds:**
- `bg-white`, `bg-primary`, `bg-gray-100`, `bg-gray-200`
- `text-white`, `text-primary`
- Category-specific background colors

**Borders & Shadows:**
- `border`, `border-transparent`, `border-gray-200`, `border-gray-300`
- `rounded-lg`, `rounded-md`, `rounded-full`
- `shadow`, `shadow-sm`, `shadow-lg`

**Interactions:**
- `hover:shadow-lg`, `hover:bg-primary/90`, `hover:bg-gray-50`, `hover:bg-gray-200`
- `focus:outline-none`, `focus:ring-2`, `focus:ring-offset-2`, `focus:ring-primary`
- `transition-shadow`, `transition-colors`

**Utilities:**
- `overflow-hidden`
- `flex-shrink-0`, `flex-1`
- `items-center`, `justify-between`, `justify-center`
- `w-full`, `w-0`

### Responsive Breakpoints

- **Mobile:** Default (no prefix)
- **Tablet:** `sm:` (640px+)
- **Desktop:** `md:` (768px+), `lg:` (1024px+)

---

## Backend Integration Requirements

### API Endpoints Needed

Based on the page requirements, you'll need the following API endpoints:

#### 1. Get All Templates
```
GET /api/v1/templates
Query Parameters:
  - category?: string
  - search?: string
  - page?: number
  - pageSize?: number
  - sortBy?: 'popular' | 'rating' | 'date' | 'name'
  - order?: 'asc' | 'desc'
  - format?: string
  - minRating?: number
```

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [Template],
    "pagination": {
      "page": 1,
      "pageSize": 12,
      "total": 156,
      "totalPages": 13
    }
  }
}
```

#### 2. Get Template Statistics
```
GET /api/v1/templates/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTemplates": 156,
    "totalDownloads": 2847,
    "averageRating": 4.6,
    "availableCategories": 12
  }
}
```

#### 3. Get Categories
```
GET /api/v1/templates/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "employment",
      "name": { "en": "Employment", "ar": "التوظيف" },
      "count": 45
    }
  ]
}
```

#### 4. Get Popular Templates
```
GET /api/v1/templates/popular?limit=5
```

#### 5. Toggle Favorite
```
POST /api/v1/templates/:id/favorite
DELETE /api/v1/templates/:id/favorite
```

#### 6. Get Template Preview
```
GET /api/v1/templates/:id/preview
```

#### 7. Use/Copy Template
```
POST /api/v1/templates/:id/use
```

**Response:**
```json
{
  "success": true,
  "data": {
    "templateId": 1,
    "contractId": 123,
    "redirectUrl": "/dashboard/contracts/123"
  }
}
```

#### 8. Create Template (Admin)
```
POST /api/v1/templates
Content-Type: multipart/form-data

Body:
  - title_en: string
  - title_ar: string
  - category_id: number
  - description_en: string
  - description_ar: string
  - file: File
  - tags: string[]
```

### Database Schema Requirements

Based on the migration file found, the backend should have:

**Tables:**
- `contract_templates` - Main template storage
- `contract_categories` - Category definitions
- `user_favorites` - User favorite templates
- `template_downloads` - Download tracking

**Template Model Fields:**
- `template_id`
- `category_id`
- `title_en`, `title_ar`
- `description_en`, `description_ar`
- `file_path`
- `file_size`
- `file_format`
- `tags`
- `version`
- `is_featured`
- `is_premium`
- `is_active`
- `usage_count`
- `avg_rating`
- `review_count`
- `created_by`
- `created_at`
- `updated_at`

**Note:** The contract management system was removed from the backend, so you'll need to re-implement these tables and endpoints if they don't exist.

---

## Implementation Checklist

### Phase 1: Backend Setup

- [ ] Create database tables for templates
  - [ ] `contract_templates` table
  - [ ] `contract_categories` table
  - [ ] `user_favorites` table
  - [ ] `template_downloads` table (optional, for analytics)

- [ ] Create backend models
  - [ ] `Template` model
  - [ ] `Category` model
  - [ ] `UserFavorite` model

- [ ] Create backend repositories
  - [ ] `TemplateRepository`
  - [ ] `CategoryRepository`
  - [ ] `FavoriteRepository`

- [ ] Create backend services
  - [ ] `TemplateService`
  - [ ] `CategoryService`
  - [ ] `FavoriteService`

- [ ] Create API routes
  - [ ] `GET /api/v1/templates` - List templates
  - [ ] `GET /api/v1/templates/:id` - Get template details
  - [ ] `GET /api/v1/templates/stats` - Get statistics
  - [ ] `GET /api/v1/templates/categories` - Get categories
  - [ ] `GET /api/v1/templates/popular` - Get popular templates
  - [ ] `POST /api/v1/templates/:id/favorite` - Toggle favorite
  - [ ] `GET /api/v1/templates/:id/preview` - Get preview
  - [ ] `POST /api/v1/templates/:id/use` - Use template
  - [ ] `POST /api/v1/templates` - Create template (admin)
  - [ ] `PUT /api/v1/templates/:id` - Update template (admin)
  - [ ] `DELETE /api/v1/templates/:id` - Delete template (admin)

- [ ] Create Pydantic schemas
  - [ ] `TemplateCreate`
  - [ ] `TemplateUpdate`
  - [ ] `TemplateResponse`
  - [ ] `CategoryResponse`

### Phase 2: Frontend API Integration

- [ ] Create API client functions
  - [ ] `getTemplates(params)`
  - [ ] `getTemplateStats()`
  - [ ] `getCategories()`
  - [ ] `getPopularTemplates(limit)`
  - [ ] `toggleFavorite(templateId)`
  - [ ] `previewTemplate(templateId)`
  - [ ] `useTemplate(templateId)`
  - [ ] `createTemplate(data)`

- [ ] Replace mock data with API calls
  - [ ] Replace `templates` array with API fetch
  - [ ] Replace hardcoded statistics with API fetch
  - [ ] Replace hardcoded categories with API fetch

- [ ] Add state management
  - [ ] Add loading states
  - [ ] Add error states
  - [ ] Add data state (templates, stats, categories)
  - [ ] Add search query state
  - [ ] Add filter state
  - [ ] Add pagination state

### Phase 3: Search & Filter Implementation

- [ ] Implement search functionality
  - [ ] Add search query state
  - [ ] Debounce search input
  - [ ] Filter templates by search query
  - [ ] Highlight search terms in results

- [ ] Implement filter functionality
  - [ ] Create filter modal/dropdown
  - [ ] Add filter by rating
  - [ ] Add filter by format
  - [ ] Add filter by date range
  - [ ] Add filter by favorites
  - [ ] Add filter by premium/free
  - [ ] Add sort options

- [ ] Connect search and filters to API
  - [ ] Update API calls with query parameters
  - [ ] Implement server-side filtering

### Phase 4: Template Actions

- [ ] Implement Preview functionality
  - [ ] Create preview modal component
  - [ ] Fetch template preview data
  - [ ] Display template preview
  - [ ] Add download option in preview

- [ ] Implement Use/Copy functionality
  - [ ] Create template editor or copy flow
  - [ ] Handle template usage tracking
  - [ ] Redirect to contract creation/editor

- [ ] Implement Favorite toggle
  - [ ] Update favorite state optimistically
  - [ ] Call favorite API endpoint
  - [ ] Handle errors and rollback

- [ ] Implement Download functionality
  - [ ] Add download endpoint
  - [ ] Track downloads
  - [ ] Handle file download

### Phase 5: Template Management (Admin)

- [ ] Create "Add New Template" modal/form
  - [ ] Form fields (title, category, description, file upload)
  - [ ] Validation
  - [ ] File upload handling
  - [ ] Submit to API

- [ ] Create template edit functionality
  - [ ] Edit button on template cards (admin only)
  - [ ] Edit form
  - [ ] Update API call

- [ ] Create template delete functionality
  - [ ] Delete button (admin only)
  - [ ] Confirmation dialog
  - [ ] Delete API call

### Phase 6: Enhanced Features

- [ ] Add pagination or infinite scroll
- [ ] Add loading skeletons
- [ ] Add empty states
- [ ] Add error boundaries
- [ ] Add toast notifications
- [ ] Add template detail page
- [ ] Add template rating/review functionality
- [ ] Add template tags management
- [ ] Add bulk actions (admin)

### Phase 7: Localization

- [ ] Move all hardcoded strings to translation files
- [ ] Add translation keys for templates page
- [ ] Test RTL layout thoroughly
- [ ] Ensure all new features support RTL

### Phase 8: Testing & Optimization

- [ ] Add unit tests for components
- [ ] Add integration tests for API calls
- [ ] Test error handling
- [ ] Optimize performance (lazy loading, memoization)
- [ ] Test on different screen sizes
- [ ] Test with real data
- [ ] Performance profiling

---

## Code Examples

### Example: Fetching Templates with React Query

```typescript
import { useQuery } from '@tanstack/react-query';

const useTemplates = (filters: TemplateFilters) => {
  return useQuery({
    queryKey: ['templates', filters],
    queryFn: () => getTemplates(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Example: Template Card with Actions

```typescript
const handlePreview = async (templateId: number) => {
  const preview = await previewTemplate(templateId);
  // Open preview modal
};

const handleUse = async (templateId: number) => {
  const result = await useTemplate(templateId);
  router.push(`/dashboard/contracts/${result.contractId}`);
};

const handleFavorite = async (templateId: number, currentState: boolean) => {
  // Optimistic update
  updateLocalFavorite(templateId, !currentState);
  
  try {
    await toggleFavorite(templateId);
  } catch (error) {
    // Rollback on error
    updateLocalFavorite(templateId, currentState);
    showError('Failed to update favorite');
  }
};
```

---

## Notes & Considerations

1. **Current State:** The templates page is a UI-only implementation with mock data. The backend contract management system was removed, so you'll need to rebuild it.

2. **Performance:** Consider implementing pagination or virtual scrolling for large template lists.

3. **Caching:** Use React Query or SWR for efficient data fetching and caching.

4. **Accessibility:** Ensure all interactive elements are keyboard accessible and have proper ARIA labels.

5. **Security:** Implement proper authentication and authorization for template management actions.

6. **File Storage:** Decide on file storage solution (local filesystem, S3, etc.) for template files.

7. **Analytics:** Consider tracking template views, downloads, and usage for insights.

8. **Versioning:** Templates may need version control to track changes over time.

---

## Related Files

- **Component:** `app/dashboard/templates/page.tsx`
- **Layout:** `components/dashboard/dashboard-layout.tsx`
- **Translation Hook:** `hooks/useTranslation.tsx`
- **API Client:** (To be created in `lib/api/`)

---

## Questions & Next Steps

1. **Backend Status:** Check if contract management tables exist in the database. If not, create migrations.

2. **File Storage:** Decide where template files will be stored and how they'll be accessed.

3. **Permissions:** Determine who can create/edit/delete templates (admin only?).

4. **Template Format:** What file formats will be supported? (DOCX, PDF, HTML?)

5. **Template Variables:** Will templates support variables for customization? This affects the data structure.

6. **Preview:** How will template preview work? (PDF viewer, HTML render, image thumbnail?)

---

**Last Updated:** Generated from current codebase state
**Version:** 1.0.0

