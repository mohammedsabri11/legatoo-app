# Document Upload Flow Diagram

## Complete Data Flow Visualization

```mermaid
graph TB
    subgraph "Frontend Components"
        UI[Admin Upload Page]
        MO[Upload Metadata Modal]
        DR[Drag & Drop Area]
        FL[File List Component]
    end
    
    subgraph "State Management"
        LF[Local Files State]
        PF[Pending Files State] 
        MM[Modal State]
    end
    
    subgraph "React Query Layer"
        QU[useDocumentUpload Hook]
        QD[useDocuments Hook]
        QT[useStartTraining Hook]
    end
    
    subgraph "API Layer"
        AU[uploadDocuments API]
        GD[getDocuments API]
        ST[startTraining API]
    end
    
    subgraph "Backend"
        UP[Upload Endpoint]
        DL[Document List Endpoint]
        TR[Training Endpoint]
    end
    
    %% User Interactions
    UI --> DR
    DR --> PF
    PF --> MO
    MO --> QU
    QU --> AU
    AU --> UP
    
    %% Data Flow
    UI --> QD
    QD --> GD
    GD --> DL
    
    UI --> QT
    QT --> ST
    ST --> TR
    
    %% State Updates
    AU --> LF
    GD --> LF
    UP --> LF
    
    %% Visual styling
    classDef frontend fill:#e1f5fe
    classDef state fill:#f3e5f5
    classDef query fill:#e8f5e8
    classDef api fill:#fff3e0
    classDef backend fill:#ffebee
    
    class UI,MO,DR,FL frontend
    class LF,PF,MM state
    class QU,QD,QT query
    class AU,GD,ST api
    class UP,DL,TR backend
```

## File States Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Selected: User selects files
    
    Selected --> Validating: Files validated
    Validating --> Invalid: Validation fails
    Validating --> MetadataCollection: Files valid
    
    Invalid --> [*]: Show error message
    
    MetadataCollection --> MetadataProvided: User fills metadata
    MetadataCollection --> Cancelled: User cancels
    
    Cancelled --> [*]
    
    MetadataProvided --> Uploading: API call starts
    Uploading --> Processing: Files uploaded
    Processing --> Completed: Analysis finished
    Processing --> Error: Processing failed
    Uploading --> Error: Upload failed
    
    Completed --> [*]
    Error --> [*]
```

## Component Interaction Timeline

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Upload Page
    participant M as Modal
    participant H as Hook
    participant A as API
    participant B as Backend
    
    U->>UI: Select files
    UI->>UI: Validate files
    UI->>M: Show metadata modal
    M->>U: Collect language + contract type
    U->>M: Submit metadata
    M->>UI: Return metadata
    UI->>H: Call upload mutation
    H->>A: POST with FormData
    A->>B: Send files + metadata
    B->>A: Return file IDs + status
    A->>H: Return response
    H->>UI: Update file states
    UI->>U: Show upload progress
    B->>H: Processing callbacks (optional)
    H->>UI: Update to completed
    UI->>U: Show analysis results
```

## Data Structures

### Local State (UploadedFile)
```typescript
{
  id: "temp_12345",           // Temporary until API response
  file: File,                 // Browser File object
  status: "uploading",        // Current processing state
  progress: 0,               // Upload percentage
  metadata: {                // User-provided data
    language: "english",
    contractType: "EMPLOYMENT_CONTRACT"
  },
  analysis: {                // AI analysis results
    type: "Employment Agreement",
    confidence: 94,
    keyPoints: ["Salary", "Terms", "Benefits"]
  }
}
```

### API Request Format
```typescript
FormData {
  language: "english",
  contract_type: "EMPLOYMENT_CONTRACT",
  files: [
    File("contract1.pdf"),
    File("contract2.docx"),
    File("contract3.pdf")
  ]
}
```

### API Response Format
```typescript
{
  success: true,
  message: "Files uploaded successfully",
  data: {
    uploaded_files: [
      {
        id: "api_file_id_1",
        filename: "contract1.pdf",
        size: 1048576,
        status: "completed",
        analysis: {
          type: "Employment Agreement",
          confidence: 94,
          keyPoints: ["Salary", "Terms", "Benefits"]
        }
      }
    ]
  },
  errors: []
}
```

## Error Handling Flow

```mermaid
graph TD
    A[User Action] --> B{Validation Check}
    B -->|Pass| C[API Call]
    B -->|Fail| D[Show Validation Error]
    
    C --> E{API Response}
    E -->|Success| F[Update UI State]
    E -->|Error| G[Show API Error]
    
    F --> H[Show Success Toast]
    G --> I[Show Error Toast]
    
    D --> J[Allow Retry]
    G --> J
    I --> J
```

## Key Features Explained

### 1. Multi-File Upload
- **Drag & Drop**: Users can drag multiple files at once
- **File Selection**: Click to browse and select multiple files
- **Batch Processing**: All files processed together with same metadata

### 2. Metadata Collection
- **Language Selection**: Choose between English and Arabic
- **Contract Types**: Predefined dropdown with legal document types
- **Validation**: Ensures all required metadata is provided

### 3. Progress Tracking
- **Real-time Updates**: Shows upload progress for each file
- **Status Indicators**: Clear visual feedback for each file's state
- **Error Handling**: Specific error messages for different failure types

### 4. State Management
- **Optimistic Updates**: Immediate UI feedback before API confirmation
- **Cache Management**: Automatic refresh of document lists
- **Persistent State**: Maintains file state throughout the session

### 5. Security
- **Authentication**: All requests include Bearer token
- **Role-based Access**: Admin-only functionality
- **File Validation**: Client and server-side file type validation
